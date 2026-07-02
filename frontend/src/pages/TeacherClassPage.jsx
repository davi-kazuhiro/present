import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout/AppLayout'
import ClassBreadcrumb from '../features/classes/ClassBreadcrumb'
import ClassHeader from '../features/classes/ClassHeader'
import ClassActions from '../features/classes/ClassActions'
import AttendanceList from '../features/classes/AttendanceList'
import NewAttendanceModal from '../features/classes/NewAttendanceModal'
import LiveAttendanceModal from '../features/classes/LiveAttendanceModal'
import TeacherStudentsPanel from '../features/classes/TeacherStudentsPanel'
import TeacherInvitePanel from '../features/classes/TeacherInvitePanel'
import {
  approveManualCheckIn,
  closeAttendance,
  enrollStudent,
  getAttendanceRequests,
  getClassAttendances,
  getAttendanceDetail,
  getClassStudents,
  getInviteLink,
  getTeacherClass,
  openAttendance,
  regenerateInviteLink,
  removeStudent,
} from '../services/classes.service'
import { getPrecisePosition } from '../utils/geolocation'

const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00`)
  return `${String(d.getDate()).padStart(2, '0')} ${meses[d.getMonth()]} ${d.getFullYear()}`
}

function formatDateTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function csvCell(value) {
  const text = value == null ? '' : String(value)
  return `"${text.replace(/"/g, '""')}"`
}

function csvRow(values) {
  return values.map(csvCell).join(';')
}

function sanitizeFilePart(value) {
  return String(value || 'chamada')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

export default function TeacherClassPage() {
  const { id } = useParams()
  const turmaId = Number(id)
  const navigate = useNavigate()
  const [modal, setModal] = useState('none')
  const [activeAttendance, setActiveAttendance] = useState(null)
  const [manualRequests, setManualRequests] = useState([])
  const [loadingRequests] = useState(false)
  const [approvingRequestId, setApprovingRequestId] = useState(null)
  const [turma, setTurma] = useState(null)
  const [students, setStudents] = useState([])
  const [attendances, setAttendances] = useState([])
  const [email, setEmail] = useState('')
  const [invite, setInvite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingStudent, setSavingStudent] = useState(false)
  const [opening, setOpening] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')
  const [removingStudentId, setRemovingStudentId] = useState(null)

  const proximoNumero = useMemo(() => attendances.length + 1, [attendances.length])

  async function loadClass() {
    setMessage('')
    try {
      const [classData, classStudents, classAttendances] = await Promise.all([
        getTeacherClass(turmaId),
        getClassStudents(turmaId),
        getClassAttendances(turmaId),
      ])

      setTurma(classData)
      setStudents(classStudents)
      setAttendances(classAttendances)

      const open = classAttendances.find((attendance) => attendance.isOpen)
      if (open) {
        setActiveAttendance({
          chamadaId: open.id,
          titulo: open.title,
          duracao: open.durationMin,
          expiresAt: open.expiresAt,
          secondsLeft: open.secondsLeft,
          present: open.present,
        })
      } else {
        setActiveAttendance(null)
      }
    } catch {
      setMessageType('error')
      setMessage('Não foi possível carregar esta matéria.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (turmaId) loadClass()
  }, [turmaId])

  useEffect(() => {
    if (!activeAttendance) return

    const id = setInterval(() => {
      getClassAttendances(turmaId).then((items) => {
        setAttendances(items)
        const live = items.find((item) => item.id === activeAttendance.chamadaId)
        if (live) {
          setActiveAttendance((current) => ({
            ...current,
            present: live.present,
            expiresAt: live.expiresAt,
            secondsLeft: live.secondsLeft,
            isOpen: live.isOpen,
          }))
          if (!live.isOpen) {
            setModal('none')
            setActiveAttendance(null)
            loadClass()
          }
        }
      })
    }, 5000)

    return () => clearInterval(id)
  }, [activeAttendance?.chamadaId, turmaId])

  useEffect(() => {
    if (!activeAttendance?.chamadaId) {
      setManualRequests([])
      return
    }

    async function loadRequests(showLoading = false) {
      if (showLoading) setLoadingRequests(true)
      try {
        const requests = await getAttendanceRequests(turmaId, activeAttendance.chamadaId)
        setManualRequests(requests)
      } catch (err) {
        console.error('Erro ao carregar solicitações:', err)
      } finally {
        if (showLoading) setLoadingRequests(false)
      }
    }

    loadRequests(true)
    const interval = setInterval(loadRequests, 2000)
    return () => clearInterval(interval)
  }, [activeAttendance?.chamadaId, turmaId])

  function handleAbrirChamadaDetalhe(attendanceId) {
    navigate(`/teacher/classes/${turmaId}/attendances/${attendanceId}`)
  }

  async function handleStartAttendance(dados) {
    setOpening(true)
    setMessage('')

    try {
      const location = await getPrecisePosition({ desiredAccuracy: 20, timeoutMs: 5000 })
      const result = await openAttendance({
        turmaId,
        titulo: dados.titulo,
        conteudo: dados.conteudo,
        latitude: location.latitude,
        longitude: location.longitude,
        raioMetros: dados.raio,
        duracaoMinutos: dados.duracao,
      })

      if (!result.success) {
        setMessageType('error')
        setMessage(result.error)
        return
      }

      setActiveAttendance({
        ...dados,
        chamadaId: result.session.chamadaId,
        present: 0,
        expiresAt: result.session.expiresAt,
        latitude: result.session.latitude,
        longitude: result.session.longitude,
        accuracy: location.accuracy,
      })
      setModal('live')
      await loadClass()
    } catch (error) {
      setMessageType('error')
      setMessage(error instanceof Error ? error.message : 'Não foi possível ler sua localização.')
    } finally {
      setOpening(false)
    }
  }

  async function handleEndAttendance() {
    if (activeAttendance?.chamadaId) {
      await closeAttendance(activeAttendance.chamadaId)
    }
    setModal('none')
    setActiveAttendance(null)
    await loadClass()
  }

  async function handleApproveRequest(requestId) {
    if (!activeAttendance?.chamadaId) return
    setApprovingRequestId(requestId)
    try {
      const result = await approveManualCheckIn(activeAttendance.chamadaId, requestId)
      if (result.success) {
        const requests = await getAttendanceRequests(turmaId, activeAttendance.chamadaId)
        setManualRequests(requests)
        await loadClass()
      }
    } finally {
      setApprovingRequestId(null)
    }
  }

  async function handleAbrirChamada() {
    if (activeAttendance?.chamadaId) {
      setModal('live')
    } else {
      setModal('config')
    }
  }

  async function handleAddStudent(event) {
    event.preventDefault()
    if (!email.trim()) return

    setSavingStudent(true)
    setMessage('')
    const result = await enrollStudent(turmaId, email)
    setSavingStudent(false)

    if (!result.success) {
      setMessageType('error')
      setMessage(result.error)
      return
    }

    setEmail('')
    await loadClass()
  }

  async function loadInvite() {
    try {
      setInvite(await getInviteLink(turmaId))
    } catch {
      setMessageType('error')
      setMessage('Não foi possível carregar o convite da matéria.')
    }
  }

  async function handleRegenerateInvite() {
    try {
      setInvite(await regenerateInviteLink(turmaId))
    } catch {
      setMessageType('error')
      setMessage('Não foi possível regenerar o convite.')
    }
  }

  async function handleCopyInvite() {
    if (!invite?.token) return
    const url = `${window.location.origin}/join/${invite.token}`
    await navigator.clipboard?.writeText(url)
    setMessageType('success')
    setMessage('Link de convite copiado.')
  }

  async function handleRemoveStudent(alunoId, studentName) {
    setRemovingStudentId(alunoId)
    setMessage('')

    const result = await removeStudent(turmaId, alunoId)

    if (!result.success) {
      setMessageType('error')
      setMessage(result.error)
      setRemovingStudentId(null)
      return
    }

    setStudents((current) => current.filter((student) => student.id !== alunoId))
    setMessageType('success')
    setMessage(`${studentName || 'Aluno'} removido da matéria.`)
    await loadClass()
    setMessageType('success')
    setMessage(`${studentName || 'Aluno'} removido da matéria.`)
    setRemovingStudentId(null)
  }

  async function handleBaixar(attendanceId) {
    try {
      const { attendance, students: attendanceStudents } = await getAttendanceDetail(turmaId, attendanceId)

      const total = attendanceStudents.length
      const generatedAt = new Date().toLocaleString('pt-BR')
      const rows = [
        csvRow(['Relatório de Presença - Present']),
        csvRow(['Gerado em', generatedAt]),
        csvRow([]),
        csvRow(['Dados da chamada']),
        csvRow(['Matéria', attendance.class?.subject ?? turma?.disciplina ?? turma?.subject ?? '']),
        csvRow(['Turma', attendance.class?.name ?? turma?.name ?? '']),
        csvRow(['Curso', attendance.class?.course ?? turma?.course ?? '']),
        csvRow(['Chamada', attendance.title]),
        csvRow(['Data', formatDate(attendance.date)]),
        csvRow(['Horário de abertura', attendance.time]),
        csvRow(['Duração', `${attendance.durationMin} min`]),
        csvRow(['Raio configurado', `${attendance.radiusMeters}m`]),
        csvRow(['Status', attendance.isOpen ? 'Aberta' : 'Encerrada']),
        csvRow(['Conteúdo', attendance.content || 'Sem conteúdo informado']),
        csvRow([]),
        csvRow(['Resumo']),
        csvRow(['Total de alunos', total]),
        csvRow(['Presentes', attendance.present]),
        csvRow(['Ausentes', attendance.absent]),
        csvRow(['Presença', `${attendance.rate.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%`]),
        csvRow([]),
        csvRow(['Lista de alunos']),
        csvRow(['#', 'Nome', 'Email', 'Situação', 'Respondido em', 'Distância do professor']),
        ...attendanceStudents.map((student, index) =>
          csvRow([
            index + 1,
            student.name,
            student.email,
            student.present ? 'Presente' : 'Ausente',
            student.answeredAt ? formatDateTime(student.answeredAt) : '',
            student.distanceMeters != null ? `${Math.round(Number(student.distanceMeters))}m` : '',
          ])
        ),
      ].join('\n')

      const blob = new Blob(['\uFEFF' + rows], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `presenca-${sanitizeFilePart(attendance.title)}-${attendance.date}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setMessageType('error')
      setMessage('Não foi possível baixar a lista de presença.')
    }
  }

  const inviteUrl = invite?.token ? `${window.location.origin}/join/${invite.token}` : ''
  const qrUrl = inviteUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(inviteUrl)}`
    : ''

  if (loading) {
    return (
      <AppLayout>
        <div className="px-7 py-12 text-sm text-text-secondary">Carregando matéria...</div>
      </AppLayout>
    )
  }

  if (!turma) {
    return (
      <AppLayout>
        <div className="flex flex-col gap-3 px-7 py-12">
          <p className="text-sm font-semibold text-danger-600">{message || 'Matéria não encontrada.'}</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard/teacher')}
            className="w-fit rounded-lg border border-border-default px-4 py-2 text-sm font-semibold"
          >
            Voltar
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 px-7 py-6 pb-12 max-sm:px-4">
        <ClassBreadcrumb turma={turma} onBack={() => navigate('/dashboard/teacher')} />

        {message && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
              messageType === 'success'
                ? 'border-success-100 bg-success-50 text-success-600'
                : 'border-danger-100 bg-danger-50 text-danger-600'
            }`}
          >
            {message}
          </div>
        )}

        <ClassHeader info={{ ...turma, enrolledCount: students.length }} role="teacher"/>
        <ClassActions
          onAbrirChamada={handleAbrirChamada}
          hasActiveAttendance={Boolean(activeAttendance?.chamadaId)}
        />

        <TeacherStudentsPanel
          email={email}
          students={students}
          savingStudent={savingStudent}
          onEmailChange={setEmail}
          onAddStudent={handleAddStudent}
          onRemoveStudent={handleRemoveStudent}
        />

        <TeacherInvitePanel
          invite={invite}
          inviteUrl={inviteUrl}
          qrUrl={qrUrl}
          onCopyInvite={handleCopyInvite}
          onLoadInvite={loadInvite}
          onRegenerateInvite={handleRegenerateInvite}
        />

        <AttendanceList
          items={attendances}
          total={attendances.length}
          onBaixar={handleBaixar}
          onAbrir={handleAbrirChamadaDetalhe}
          onVerTodas={() => {}}
        />

        <NewAttendanceModal
          open={modal === 'config'}
          onClose={() => setModal('none')}
          turma={turma}
          proximoNumero={proximoNumero}
          opening={opening}
          onAbrir={handleStartAttendance}
        />

        <LiveAttendanceModal
          open={modal === 'live'}
          attendance={{ ...activeAttendance, opening }}
          turma={{ ...turma, enrolledCount: students.length }}
          manualRequests={manualRequests}
          loadingRequests={loadingRequests}
          approvingRequestId={approvingRequestId}
          onApproveRequest={handleApproveRequest}
          onClose={handleEndAttendance}
          onDismiss={() => setModal('none')}
        />
      </div>
    </AppLayout>
  )
}
