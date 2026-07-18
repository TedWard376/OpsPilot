import type { ServerStatus } from '../../data/servers'

interface ServerHealthIndicatorProps {
  status: ServerStatus
  size?: 'sm' | 'md'
}

const statusColors: Record<ServerStatus, string> = {
  Healthy: 'bg-green-500',
  Warning: 'bg-amber-500',
  Critical: 'bg-red-500',
}

const sizeClasses = {
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
}

export function ServerHealthIndicator({ status, size = 'sm' }: ServerHealthIndicatorProps) {
  return (
    <span
      className={`shrink-0 rounded-full ${statusColors[status]} ${sizeClasses[size]}`}
      aria-label={`Server status: ${status}`}
      role="img"
    />
  )
}
