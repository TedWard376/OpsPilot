import type { IncidentItem } from '../../data/incidents'
import { IncidentStatusBadge } from './IncidentStatusBadge'
import { PriorityBadge } from './PriorityBadge'

interface IncidentRowProps {
  incident: IncidentItem
  onClick: (incident: IncidentItem) => void
}

export function IncidentRow({ incident, onClick }: IncidentRowProps) {
  const [primarySystem, ...restSystems] = incident.affectedSystems

  return (
    <tr
      onClick={() => onClick(incident)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(incident)
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={`View details for ${incident.id}`}
      className="cursor-pointer border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[var(--page-background)] focus:bg-[var(--page-background)] focus:outline-none"
    >
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] font-medium text-blue-600">{incident.id}</td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] font-medium text-[var(--foreground)]">{incident.title}</td>
      <td className="px-3 py-3">
        <PriorityBadge priority={incident.priority} />
      </td>
      <td className="px-3 py-3">
        <IncidentStatusBadge status={incident.status} />
      </td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] text-[var(--muted-foreground)]">{incident.assignedEngineer}</td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] text-[var(--muted-foreground)]">{incident.createdAt}</td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] text-[var(--muted-foreground)]">{incident.updatedAt}</td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] text-[var(--muted-foreground)]">{incident.duration}</td>
      <td className="px-3 py-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate rounded-md bg-[var(--page-background)] px-2 py-0.5 text-[11px] font-medium text-[var(--foreground)]">
            {primarySystem}
          </span>
          {restSystems.length > 0 && <span className="shrink-0 text-[11px] text-[var(--muted-foreground)]">+{restSystems.length}</span>}
        </div>
      </td>
    </tr>
  )
}
