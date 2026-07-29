import type { AlertItem } from '../../types/alert'
import { AlertStatusBadge } from './AlertStatusBadge'
import { SeverityBadge } from './SeverityBadge'

interface AlertRowProps {
  alert: AlertItem
  onClick: (alert: AlertItem) => void
}

export function AlertRow({ alert, onClick }: AlertRowProps) {
  return (
    <tr
      onClick={() => onClick(alert)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(alert)
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={`View details for ${alert.id}`}
      className="cursor-pointer border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[var(--page-background)] focus:bg-[var(--page-background)] focus:outline-none"
    >
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] font-medium text-blue-600">{alert.id}</td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] font-medium text-[var(--foreground)]">{alert.name}</td>
      <td className="px-3 py-3">
        <SeverityBadge severity={alert.severity} />
      </td>
      <td className="px-3 py-3">
        <AlertStatusBadge status={alert.status} />
      </td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] text-[var(--muted-foreground)]">{alert.source}</td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] text-[var(--muted-foreground)]">{alert.affectedServerHostname}</td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] text-[var(--muted-foreground)]">{alert.environment}</td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] text-[var(--muted-foreground)]">{alert.triggerTime}</td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] text-[var(--muted-foreground)]">{alert.duration}</td>
    </tr>
  )
}
