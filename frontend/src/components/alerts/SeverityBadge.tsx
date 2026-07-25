import type { AlertSeverity } from '../../data/alerts'

interface SeverityBadgeProps {
  severity: AlertSeverity
}

const severityStyles: Record<AlertSeverity, string> = {
  Critical: 'bg-red-50 text-red-700',
  High: 'bg-orange-50 text-orange-700',
  Medium: 'bg-yellow-50 text-yellow-700',
  Low: 'bg-blue-50 text-blue-700',
  Informational: 'bg-gray-100 text-gray-600',
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ${severityStyles[severity]}`}
    >
      {severity}
    </span>
  )
}
