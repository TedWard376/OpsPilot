import { ChevronRight, LifeBuoy } from 'lucide-react'
import type { RelatedIncidentRef } from '../../../types/alertDetail'
import { PriorityBadge } from '../../incidents/PriorityBadge'
import { IncidentStatusBadge } from '../../incidents/IncidentStatusBadge'

interface RelatedIncidentsPanelProps {
  incidents: RelatedIncidentRef[]
  onIncidentClick: (incident: RelatedIncidentRef) => void
}

export function RelatedIncidentsPanel({ incidents, onIncidentClick }: RelatedIncidentsPanelProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">Related Incidents</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Incidents connected to this alert</p>
      </div>

      {incidents.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <LifeBuoy size={20} className="text-[var(--muted-foreground)]" />
          <p className="text-sm text-[var(--muted-foreground)]">No incidents have been opened for this alert yet.</p>
        </div>
      ) : (
        <ul>
          {incidents.map((incident) => (
            <li key={incident.id}>
              <button
                type="button"
                onClick={() => onIncidentClick(incident)}
                className="flex w-full items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--page-background)]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-600">{incident.id}</span>
                    <p className="truncate text-sm font-medium text-[var(--foreground)]">{incident.title}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{incident.engineer} · {incident.createdAt}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <PriorityBadge priority={incident.priority} />
                  <IncidentStatusBadge status={incident.status} />
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
