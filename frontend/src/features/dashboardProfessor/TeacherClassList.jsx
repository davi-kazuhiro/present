import { TeacherClassCard } from './TeacherClassCard'

export function TeacherClassList({ classes, loading, totalStudents, onClassClick }) {
  return (
    <section className="rounded-lg border border-border-default bg-neutral-0 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">Minhas Turmas</h2>
        <span className="text-sm text-text-secondary">{totalStudents} alunos matriculados</span>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-text-secondary">Carregando Turmas...</div>
      ) : classes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-default px-4 py-10 text-center text-sm text-text-secondary">
          Crie sua primeira turma para adicionar alunos e abrir chamadas.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {classes.map((turma) => (
            <TeacherClassCard
              key={turma.id}
              turma={turma}
              onClick={() => onClassClick(turma)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
