import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  width?: 'md' | 'lg'
}

const widthClass: Record<'md' | 'lg', string> = {
  md: 'max-w-md',
  lg: 'max-w-2xl',
}

export function Modal({ title, description, onClose, children, footer, width = 'md' }: ModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`flex max-h-[85vh] w-full flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg ${widthClass[width]}`}
      >
        <div className="flex shrink-0 items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>
            {description && <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--page-background)] hover:text-[var(--foreground)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer && <div className="mt-5 flex shrink-0 justify-end gap-2 border-t border-[var(--border)] pt-4">{footer}</div>}
      </div>
    </div>
  )
}
