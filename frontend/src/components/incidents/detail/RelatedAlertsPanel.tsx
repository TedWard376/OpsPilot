import { ChevronRight } from 'lucide-react'
import type { RelatedAlertRef } from '../../../data/incidentDetail'
import { StatusBadge } from '../../StatusBadge'

interface RelatedAlertsPanelProps {
  alerts: RelatedAlertRef[]
  onAlertClick: (alert: RelatedAlertRef) => void
}

export function RelatedAlertsPanel({ alerts, onAlertClick }: RelatedAlertsPanelProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">Related Alerts</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Alerts correlated with this incident</p>
      </div>

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
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{alert.source} · {alert.timestamp}</p>
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
    </div>
  )
}
