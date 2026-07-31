import { ChevronRight } from 'lucide-react'
import type { RelatedIncidentRef } from '../../../types/documentation'
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
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Past incidents where this doc was used</p>
      </div>

      {incidents.length === 0 ? (
        <p className="px-5 py-6 text-center text-sm text-[var(--muted-foreground)]">No related incidents.</p>
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
                  <span className="text-sm font-semibold text-blue-600">{incident.id}</span>
                  <p className="truncate text-sm font-medium text-[var(--foreground)]">{incident.title}</p>
                </div>
                <span className="flex shrink-0 items-center gap-2">
                  <PriorityBadge priority={incident.priority} />
                  <IncidentStatusBadge status={incident.status} />
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
