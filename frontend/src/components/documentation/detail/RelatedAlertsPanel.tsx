import { ChevronRight } from 'lucide-react'
import type { RelatedAlertRef } from '../../../types/documentation'
import { SeverityBadge } from '../../alerts/SeverityBadge'

interface RelatedAlertsPanelProps {
  alerts: RelatedAlertRef[]
  onAlertClick: (alert: RelatedAlertRef) => void
}

export function RelatedAlertsPanel({ alerts, onAlertClick }: RelatedAlertsPanelProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">Related Alerts</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Alert types this doc is recommended for</p>
      </div>

      {alerts.length === 0 ? (
        <p className="px-5 py-6 text-center text-sm text-[var(--muted-foreground)]">No related alerts.</p>
      ) : (
        <ul>
          {alerts.map((alert) => (
            <li key={alert.id}>
              <button
                type="button"
                onClick={() => onAlertClick(alert)}
                className="flex w-full items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--page-background)]"
              >
                <span className="text-sm font-medium text-[var(--foreground)]">{alert.name}</span>
                <span className="flex items-center gap-2">
                  <SeverityBadge severity={alert.severity} />
                  <ChevronRight size={14} className="text-[var(--muted-foreground)]" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
