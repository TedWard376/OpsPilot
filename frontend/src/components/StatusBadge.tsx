/**
 * StatusBadge Component
 * Presentational component that displays a status badge with:
 * - Color coding based on status type
 * - Icon indicator
 * - Text label
 * Supports multiple status types: critical, high, medium, low, operational, degraded, down, open, investigating, resolved
 */

interface StatusBadgeProps {
  status: 'critical' | 'high' | 'medium' | 'low' | 'operational' | 'degraded' | 'down' | 'open' | 'investigating' | 'resolved' | 'acknowledged'
  size?: 'sm' | 'md'
  label?: string
}

const statusConfig = {
  critical: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    label: 'Critical',
  },
  high: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
    label: 'High',
  },
  medium: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    dot: 'bg-yellow-500',
    label: 'Medium',
  },
  low: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    label: 'Low',
  },
  operational: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
    label: 'Operational',
  },
  degraded: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    label: 'Degraded',
  },
  down: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    label: 'Down',
  },
  open: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    label: 'Open',
  },
  investigating: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    label: 'Investigating',
  },
  resolved: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
    label: 'Resolved',
  },
  acknowledged: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    label: 'Acknowledged',
  },
}

const sizeConfig = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
}

export function StatusBadge({ status, size = 'sm', label }: StatusBadgeProps) {
  const config = statusConfig[status]
  const sizeClass = sizeConfig[size]
  const displayLabel = label || config.label

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClass}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {displayLabel}
    </div>
  )
}
