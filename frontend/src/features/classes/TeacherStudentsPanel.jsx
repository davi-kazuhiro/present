import { MailPlus, Trash2, UserCheck, Users } from 'lucide-react'

export default function TeacherStudentsPanel({
  email,
  students,
  savingStudent,
  onEmailChange,
  onAddStudent,
  onRemoveStudent,
}) {
  return (
    <section className="grid grid-cols-[0.8fr_1.2fr] gap-4 max-lg:grid-cols-1">
      <div className="rounded-lg border border-border-default bg-bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Adicionar alunos</h2>
            <p className="text-sm text-text-secondary">Use o e-mail que o aluno cadastrou no app.</p>
          </div>
          <MailPlus className="h-5 w-5 text-primary-600" />
        </div>

        <form onSubmit={onAddStudent} className="flex gap-2 max-sm:flex-col">
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="aluno@email.com"
            className="h-11 min-w-0 flex-1 rounded-lg border border-border-default px-3 text-sm outline-none focus:border-primary-400"
          />
          <button
            type="submit"
            disabled={savingStudent}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-800 px-4 text-sm font-semibold text-neutral-0 transition hover:bg-primary-900 disabled:opacity-60"
          >
            <UserCheck className="h-4 w-4" />
            {savingStudent ? 'Adicionando...' : 'Adicionar'}
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-border-default bg-bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">Alunos da matéria</h2>
          <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
            <Users className="h-4 w-4" />
            {students.length}
          </span>
        </div>

        {students.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border-default px-4 py-8 text-center text-sm text-text-secondary">
            Nenhum aluno adicionado ainda.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border-default px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">{student.name}</p>
                  <p className="truncate text-xs text-text-secondary">{student.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveStudent(student.id)}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-danger-600 transition hover:bg-danger-50"
                  aria-label={`Remover ${student.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
