const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c', '#0891b2', '#be123c', '#475569']
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

export function TeacherClassForm({
  form,
  saving,
  error,
  onSubmit,
  onFieldChange,
  onScheduleChange,
  onAddSchedule,
  onRemoveSchedule,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-border-default bg-neutral-0 p-5 shadow-card"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Criar Turma</h2>
          <p className="text-sm text-text-secondary">Depois adicione alunos pelo e-mail cadastrado.</p>
        </div>
        <i className="fa-solid fa-plus text-[18px] text-primary-600" aria-hidden="true" />
      </div>

      <div className="grid gap-3">
        <input
          value={form.nome}
          onChange={(event) => onFieldChange('nome', event.target.value)}
          placeholder="Turma. Ex: Turma B Noite"
          required
          className="h-11 rounded-lg border border-border-default px-3 text-sm outline-none focus:border-primary-400"
        />
        <input
          value={form.disciplina}
          onChange={(event) => onFieldChange('disciplina', event.target.value)}
          placeholder="Disciplina. Ex: Engenharia de Software"
          required
          className="h-11 rounded-lg border border-border-default px-3 text-sm outline-none focus:border-primary-400"
        />
        <input
          value={form.curso}
          onChange={(event) => onFieldChange('curso', event.target.value)}
          placeholder="Curso"
          required
          className="h-11 rounded-lg border border-border-default px-3 text-sm outline-none focus:border-primary-400"
        />
        <textarea
          value={form.descricao}
          onChange={(event) => onFieldChange('descricao', event.target.value)}
          placeholder="Descrição da Turma"
          rows={2}
          className="resize-none rounded-lg border border-border-default px-3 py-2 text-sm outline-none focus:border-primary-400"
        />

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Cor</p>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onFieldChange('cor', color)}
                aria-label={`Selecionar cor ${color}`}
                className={`h-8 w-8 rounded-full border-2 ${form.cor === color ? 'border-neutral-900' : 'border-white'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <select
            value={form.turno}
            onChange={(event) => onFieldChange('turno', event.target.value)}
            className="h-11 rounded-lg border border-border-default px-3 text-sm outline-none focus:border-primary-400"
          >
            <option>Manhã</option>
            <option>Tarde</option>
            <option>Noite</option>
            <option>Integral</option>
          </select>
        </div>

        <div className="rounded-lg border border-border-default p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-text-primary">Horários semanais</p>
            <button
              type="button"
              onClick={onAddSchedule}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700"
            >
              <i className="fa-solid fa-plus text-[14px]" aria-hidden="true" />
              Adicionar horário
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {form.horarios.map((schedule, index) => (
              <div key={`${schedule.diaSemana}-${index}`} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                <select
                  value={schedule.diaSemana}
                  onChange={(event) => onScheduleChange(index, 'diaSemana', Number(event.target.value))}
                  className="h-10 rounded-lg border border-border-default px-2 text-sm outline-none focus:border-primary-400"
                >
                  {DAYS.map((day, dayIndex) => (
                    <option key={day} value={dayIndex}>
                      {day}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={schedule.horaInicio}
                  onChange={(event) => onScheduleChange(index, 'horaInicio', event.target.value)}
                  className="h-10 rounded-lg border border-border-default px-2 text-sm outline-none focus:border-primary-400"
                />
                <input
                  type="time"
                  value={schedule.horaFim}
                  onChange={(event) => onScheduleChange(index, 'horaFim', event.target.value)}
                  className="h-10 rounded-lg border border-border-default px-2 text-sm outline-none focus:border-primary-400"
                />
                <button
                  type="button"
                  onClick={() => onRemoveSchedule(index)}
                  disabled={form.horarios.length === 1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-default text-danger-600 disabled:opacity-40"
                  aria-label="Remover horário"
                >
                  <i className="fa-solid fa-trash text-[14px]" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-sm font-semibold text-danger-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary-800 text-sm font-semibold text-neutral-0 transition hover:bg-primary-900 disabled:opacity-60"
      >
        <i className="fa-solid fa-plus text-[16px]" aria-hidden="true" />
        {saving ? 'Criando...' : 'Criar Turma'}
      </button>
    </form>
  )
}
