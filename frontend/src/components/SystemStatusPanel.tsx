import type { SystemStatusData } from '../data/dashboard'
import { StatusBadge } from './StatusBadge'

/**
 * SystemStatusPanel Component
 * Displays the operational status of key infrastructure services
 * Shows each system with its status and uptime percentage
 */

interface SystemStatusPanelProps {
  systems: SystemStatusData[]
}

export function SystemStatusPanel({ systems, title = 'System Status', description = 'Service health and latency' }: SystemStatusPanelProps & { title?: string; description?: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
        {description && <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>}
      </div>
      <div className="space-y-2.5 p-4">
        {systems.map((system) => (
        <div key={system.name} className="flex items-center justify-between rounded-lg bg-[var(--page-background)] px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${system.status === 'operational' ? 'bg-green-500' : system.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'}`} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)]">{system.name}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Uptime {system.uptime.toFixed(2)}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--muted-foreground)]">{system.latency}</span>
            <StatusBadge status={system.status} size="sm" />
          </div>
          </div>
        ))}
      </div>
    </div>
  )
}
