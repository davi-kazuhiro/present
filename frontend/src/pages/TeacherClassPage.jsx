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
      }
    } catch {
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

    async function loadRequests() {
      try {
        const requests = await getAttendanceRequests(turmaId, activeAttendance.chamadaId)
        setManualRequests(requests)
      } catch (err) {
        console.error('Erro ao carregar solicitações:', err)
      }
    }

    loadRequests()
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
      setMessage('Não foi possível carregar o convite da matéria.')
    }
  }

  async function handleRegenerateInvite() {
    try {
      setInvite(await regenerateInviteLink(turmaId))
    } catch {
      setMessage('Não foi possível regenerar o convite.')
    }
  }

  async function handleCopyInvite() {
    if (!invite?.token) return
    const url = `${window.location.origin}/join/${invite.token}`
    await navigator.clipboard?.writeText(url)
    setMessage('Link de convite copiado.')
  }

  async function handleRemoveStudent(alunoId) {
    const result = await removeStudent(turmaId, alunoId)
    if (!result.success) {
      setMessage(result.error)
      return
    }
    await loadClass()
  }

  async function handleBaixar(attendanceId) {
  try {
    const { attendance, students: attendanceStudents } = await getAttendanceDetail(turmaId, attendanceId)

    const header = [
      `Chamada: ${attendance.title}`,
      `Data: ${formatDate(attendance.date)}`,
      `Horário: ${attendance.time}`,
      `Duração: ${attendance.durationMin} min`,
      `Presença: ${attendance.rate.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%`,
      `Presentes: ${attendance.present}`,
      `Ausentes: ${attendance.absent}`,
      `Conteúdo: ${attendance.content || 'Sem conteúdo informado'}`,
      '',
      'Nome,Email,Situação',
    ].join('\n')

    const rows = attendanceStudents
      .map((s) => `${s.name},${s.email},${s.present ? 'Presente' : 'Ausente'}`)
      .join('\n')

    const blob = new Blob(['\uFEFF' + `${header}\n${rows}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chamada-${attendance.title}-${attendance.date}.csv`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
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
          <div className="rounded-lg border border-danger-100 bg-danger-50 px-4 py-3 text-sm font-semibold text-danger-600">
            {message}
          </div>
        )}

        <ClassHeader info={{ ...turma, enrolledCount: students.length }} role="teacher"/>
        <ClassActions onAbrirChamada={handleAbrirChamada} />

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
