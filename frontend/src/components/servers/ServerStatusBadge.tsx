import type { ServerStatus } from '../../data/servers'

interface ServerStatusBadgeProps {
  status: ServerStatus
}

const statusStyles: Record<ServerStatus, string> = {
  Healthy: 'bg-green-50 text-green-700',
  Warning: 'bg-amber-50 text-amber-700',
  Critical: 'bg-red-50 text-red-700',
}

export function ServerStatusBadge({ status }: ServerStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}