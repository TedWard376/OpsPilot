import { AlertTriangle, Loader2, RotateCw } from 'lucide-react'
import { Modal } from '../../Modal'

export type RestartState = 'idle' | 'confirming' | 'restarting' | 'sent'

interface RestartConfirmModalProps {
  hostname: string
  state: RestartState
  onClose: () => void
  onConfirm: () => void
}

export function RestartConfirmModal({ hostname, state, onClose, onConfirm }: RestartConfirmModalProps) {
  const isRestarting = state === 'restarting'

  return (
    <Modal
      title="Restart Server"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isRestarting}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isRestarting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRestarting ? <Loader2 size={14} className="animate-spin" /> : <RotateCw size={14} />}
            {isRestarting ? 'Restarting…' : 'Restart Server'}
          </button>
        </>
      }
    >
      <div className="flex gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
        </span>
        <div className="text-sm text-[var(--foreground)]">
          <p>
            This will restart <span className="font-semibold">{hostname}</span> and briefly interrupt every service running on it.
          </p>
          <p className="mt-1.5 text-[var(--muted-foreground)]">Make sure any in-progress work is safe to interrupt before continuing.</p>
        </div>
      </div>
    </Modal>
  )
}
