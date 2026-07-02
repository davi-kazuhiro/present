import { Copy, QrCode, RefreshCw } from 'lucide-react'

export default function TeacherInvitePanel({
  invite,
  inviteUrl,
  qrUrl,
  onCopyInvite,
  onLoadInvite,
  onRegenerateInvite,
}) {
  const handleInviteAction = invite ? onRegenerateInvite : onLoadInvite

  return (
    <section className="rounded-lg border border-border-default bg-bg-card p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Convite por QR Code</h2>
          <p className="text-sm text-text-secondary">
            Compartilhe com os alunos para entrarem automaticamente nesta matéria.
          </p>
        </div>
        <button
          type="button"
          onClick={handleInviteAction}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border-default px-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
        >
          {invite ? <RefreshCw className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
          {invite ? 'Regenerar token' : 'Gerar convite'}
        </button>
      </div>

      {invite ? (
        <div className="grid grid-cols-[180px_1fr] gap-5 max-md:grid-cols-1">
          <img
            src={qrUrl}
            alt="QR Code do convite"
            className="h-[180px] w-[180px] rounded-lg border border-border-default bg-white p-2"
          />
          <div className="min-w-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Link de convite</p>
            <div className="flex min-w-0 gap-2 max-sm:flex-col">
              <input
                readOnly
                value={inviteUrl}
                className="h-11 min-w-0 flex-1 rounded-lg border border-border-default bg-neutral-50 px-3 text-sm text-text-primary"
              />
              <button
                type="button"
                onClick={onCopyInvite}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-800 px-4 text-sm font-semibold text-neutral-0 transition hover:bg-primary-900"
              >
                <Copy className="h-4 w-4" />
                Copiar
              </button>
            </div>
            <p className="mt-2 text-xs text-text-secondary">
              Usos: {invite.uses ?? 0}. Regenerar invalida o link anterior.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border-default px-4 py-8 text-center text-sm text-text-secondary">
          Gere um convite para exibir o QR Code e o link da matéria.
        </div>
      )}
    </section>
  )
}
