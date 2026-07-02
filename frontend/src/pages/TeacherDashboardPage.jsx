import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout/AppLayout'
import { Footer } from '../layout/Footer/Footer'
import { DashboardHeader } from '../features/dashboard/DashboardHeader'
import { MetricCard } from '../features/dashboard/MetricCard'
import { WeeklyCalendar } from '../features/calendar/WeeklyCalendar'
import { createTeacherClass, getTeacherClasses } from '../services/classes.service'
import { getCurrentUser } from '../services/auth.service'
import { TeacherClassForm } from '../features/dashboardProfessor/TeacherClassForm'
import { TeacherClassList } from '../features/dashboardProfessor/TeacherClassList'
import { INITIAL_TEACHER_CLASS_FORM } from '../features/dashboardProfessor/teacherClassForm.constants'

function formatDataHora() {
  const agora = new Date()
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const dia = dias[agora.getDay()]
  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${dia} · ${agora.getDate()} ${meses[agora.getMonth()]} · ${hora}`
}

export function TeacherDashboardPage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [classes, setClasses] = useState([])
  const [form, setForm] = useState(INITIAL_TEACHER_CLASS_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const metrics = useMemo(() => {
    const totalStudents = classes.reduce((sum, turma) => sum + Number(turma.enrolledCount ?? 0), 0)
    const openAttendances = classes.filter((turma) => turma.openSessionId).length
    const average =
      classes.length > 0
        ? Math.round(
            classes.reduce((sum, turma) => sum + Number(turma.semesterRate ?? 0), 0) / classes.length
          )
        : 0

    return { totalStudents, openAttendances, average }
  }, [classes])

  async function loadClasses() {
    setError('')
    try {
      setClasses(await getTeacherClasses())
    } catch {
      setError('Não foi possível carregar suas turmas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClasses()
  }, [])

  async function handleCreateClass(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const result = await createTeacherClass(form)
    setSaving(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    setForm(INITIAL_TEACHER_CLASS_FORM)
    setClasses((current) => [result.class, ...current])
  }

  function updateFormField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function updateSchedule(index, field, value) {
    setForm((prev) => ({
      ...prev,
      horarios: prev.horarios.map((schedule, currentIndex) =>
        currentIndex === index ? { ...schedule, [field]: value } : schedule
      ),
    }))
  }

  function addSchedule() {
    setForm((prev) => ({
      ...prev,
      horarios: [...prev.horarios, { diaSemana: 4, horaInicio: '19:00', horaFim: '21:00' }],
    }))
  }

  function removeSchedule(index) {
    setForm((prev) => ({
      ...prev,
      horarios: prev.horarios.filter((_, currentIndex) => currentIndex !== index),
    }))
  }

  return (
    <AppLayout
      calendar={
        <WeeklyCalendar
          subjects={classes}
          onSubjectClick={(turma) => navigate(`/teacher/classes/${turma.id}`)}
        />
      }
    >
      <DashboardHeader
        professorName={user?.name ?? 'Professor'}
        dataHora={formatDataHora()}
        onNotification={() => loadClasses()}
      />

      <div className="px-7 max-sm:px-4 py-6 pb-10 flex flex-col gap-4">
        <section className="grid grid-cols-3 max-lg:grid-cols-1 gap-3.5" aria-label="Métricas gerais">
          <MetricCard icon="fa-solid fa-book" value={classes.length} label="Turmas criadas" darkIcon />
          <MetricCard icon="fa-solid fa-clipboard-check" value={metrics.openAttendances} label="Chamadas abertas" darkIcon />
          <MetricCard
            icon="fa-solid fa-chart-line"
            value={`${metrics.average}%`}
            label="Frequência média"
            deltaType="positive"
            darkIcon
          />
        </section>

        <section className="grid grid-cols-[0.9fr_1.1fr] gap-4 max-xl:grid-cols-1">
          <TeacherClassList
            classes={classes}
            loading={loading}
            totalStudents={metrics.totalStudents}
            onClassClick={(turma) => navigate(`/teacher/classes/${turma.id}`)}
          />

          <TeacherClassForm
            form={form}
            saving={saving}
            error={error}
            onSubmit={handleCreateClass}
            onFieldChange={updateFormField}
            onScheduleChange={updateSchedule}
            onAddSchedule={addSchedule}
            onRemoveSchedule={removeSchedule}
          />
        </section>
      </div>

      <Footer />
    </AppLayout>
  )
}

export default TeacherDashboardPage
