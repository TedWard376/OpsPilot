import { ChevronRight } from 'lucide-react'
import type { ServerAlertItem } from '../../../data/serverDetail'
import { StatusBadge } from '../../StatusBadge'

interface ServerAlertsPanelProps {
  alerts: ServerAlertItem[]
  onAlertClick: (alert: ServerAlertItem) => void
}

export function ServerAlertsPanel({ alerts, onAlertClick }: ServerAlertsPanelProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">Recent Alerts</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Alerts triggered by this server</p>
      </div>

      {alerts.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-[var(--muted-foreground)]">No recent alerts for this server.</p>
      ) : (
        <ul>
          {alerts.map((alert) => (
            <li key={alert.id}>
              <button
                type="button"
                onClick={() => onAlertClick(alert)}
                className="flex w-full items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--page-background)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <StatusBadge status={alert.severity} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--foreground)]">{alert.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{alert.timestamp}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={alert.status} size="sm" />
                  <ChevronRight size={14} className="text-[var(--muted-foreground)]" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
