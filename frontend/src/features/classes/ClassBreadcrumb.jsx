import { ChevronLeft } from 'lucide-react'

export default function ClassBreadcrumb({ turma, backLabel = 'Matérias', onBack }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      <button
        type="button"
        onClick={onBack}
        aria-label={`Voltar para ${backLabel}`}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-text-secondary transition hover:bg-neutral-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="text-text-secondary">{backLabel}</span>
      <span className="text-text-muted">/</span>
      <span className="font-semibold text-text-primary">
        {turma.name} · {turma.section}
      </span>
    </nav>
  )
}
