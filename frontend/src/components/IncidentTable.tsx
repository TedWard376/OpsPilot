import type { IncidentData } from '../data/dashboard'
import { StatusBadge } from './StatusBadge'

/**
 * IncidentTable Component
 * Presentational component that displays ongoing and recent incidents:
 * - ID, title, priority, status, engineer, duration, affected systems
 */

interface IncidentTableProps {
  incidents: IncidentData[]
  title?: string
  description?: string
  onViewAll?: () => void
}

export function IncidentTable({ incidents, title = 'Active Incidents', description = 'Open and recent incident activity', onViewAll }: IncidentTableProps) {
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
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">ID</th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Title</th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Priority</th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Status</th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Engineer</th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Duration</th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Systems</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id} className="border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[var(--page-background)]">
              <td className="px-5 py-3 text-sm font-medium text-blue-600">{incident.id}</td>
              <td className="px-5 py-3">
                <p className="text-sm font-medium text-[var(--foreground)]">{incident.title}</p>
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={incident.severity} size="sm" />
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={incident.status} size="sm" />
              </td>
              <td className="px-5 py-3 text-sm text-[var(--muted-foreground)]">{incident.engineer}</td>
              <td className="px-5 py-3 text-sm text-[var(--muted-foreground)]">{incident.duration}</td>
              <td className="px-5 py-3 text-sm text-[var(--muted-foreground)]">{incident.affectedSystems}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
