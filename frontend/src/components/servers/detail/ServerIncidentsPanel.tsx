import type { ServerIncidentItem } from '../../../data/serverDetail'
import { StatusBadge } from '../../StatusBadge'

interface ServerIncidentsPanelProps {
  incidents: ServerIncidentItem[]
  onIncidentClick: (incident: ServerIncidentItem) => void
}

export function ServerIncidentsPanel({ incidents, onIncidentClick }: ServerIncidentsPanelProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">Related Incidents</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Incidents involving this server</p>
      </div>

      {incidents.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-[var(--muted-foreground)]">No incidents recorded for this server.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--page-background)]">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">ID</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Title</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Priority</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Status</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Engineer</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Created</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr
                key={incident.id}
                onClick={() => onIncidentClick(incident)}
                tabIndex={0}
                role="link"
                aria-label={`View details for ${incident.id}`}
                className="cursor-pointer border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[var(--page-background)]"
              >
                <td className="px-5 py-3 text-sm font-medium text-blue-600">{incident.id}</td>
                <td className="px-5 py-3 text-sm font-medium text-[var(--foreground)]">{incident.title}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={incident.priority} size="sm" />
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={incident.status} size="sm" />
                </td>
                <td className="px-5 py-3 text-sm text-[var(--muted-foreground)]">{incident.engineer}</td>
                <td className="px-5 py-3 text-sm text-[var(--muted-foreground)]">{incident.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
