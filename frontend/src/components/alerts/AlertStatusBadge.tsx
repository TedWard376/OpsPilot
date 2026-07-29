import type { AlertStatus } from '../../types/alert'

interface AlertStatusBadgeProps {
  status: AlertStatus
}

const statusStyles: Record<AlertStatus, string> = {
  Open: 'bg-red-50 text-red-700',
  Acknowledged: 'bg-amber-50 text-amber-700',
  Investigating: 'bg-blue-50 text-blue-700',
  Resolved: 'bg-green-50 text-green-700',
}

export function AlertStatusBadge({ status }: AlertStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}
