import type { AlertData } from '../data/dashboard'
import { StatusBadge } from './StatusBadge'

/**
 * AlertTable Component
 * Presentational component that displays recent critical alerts in a table format:
 * - Severity badges with color coding
 * - Alert title and affected resource
 * - Investigation status and time
 */

interface AlertTableProps {
  alerts: AlertData[]
  title?: string
  description?: string
  onViewAll?: () => void
}

export function AlertTable({ alerts, title = 'Recent Alerts', description = 'Latest notifications requiring attention', onViewAll }: AlertTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
            {description && <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>}
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="rounded-lg text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              View all ›
            </button>
          )}
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--page-background)]">
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Severity</th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Alert</th>
            <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Status</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id} className="border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[var(--page-background)]">
              <td className="px-5 py-3">
                <StatusBadge status={alert.severity} size="sm" />
              </td>
              <td className="px-5 py-3">
                <p className="text-sm font-medium text-[var(--foreground)]">{alert.title}</p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{alert.resource} · {alert.timestamp}</p>
              </td>
              <td className="px-5 py-3 text-right">
                <StatusBadge status={alert.investigation} size="sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
