import type { IncidentStatus } from '../../data/incidents'

interface IncidentStatusBadgeProps {
  status: IncidentStatus
}

const statusStyles: Record<IncidentStatus, string> = {
  Open: 'bg-red-50 text-red-700',
  Investigating: 'bg-blue-50 text-blue-700',
  Monitoring: 'bg-amber-50 text-amber-700',
  Resolved: 'bg-green-50 text-green-700',
  Closed: 'bg-gray-100 text-gray-600',
}

export function IncidentStatusBadge({ status }: IncidentStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}
