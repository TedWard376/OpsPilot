import type { ReactNode } from 'react'

/**
 * ChartCard Component
 * Container component for chart visualizations:
 * - Consistent card styling
 * - Title and optional description
 * - Acts as a wrapper for chart libraries (charts are passed as children)
 */

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

export function ChartCard({ title, description, children, footer }: ChartCardProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      {(title || description) && (
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
            {description && <p className="mt-1 text-xs text-[var(--muted-foreground)]">{description}</p>}
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1">{children}</div>

      {footer && <div className="mt-4 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted-foreground)]">{footer}</div>}
    </div>
  )
}
