import { ChevronRight } from 'lucide-react'
import type { AffectedServerRef } from '../../../data/incidentDetail'
import { ServerHealthIndicator } from '../../servers/ServerHealthIndicator'

interface AffectedServersPanelProps {
  servers: AffectedServerRef[]
  onServerClick: (server: AffectedServerRef) => void
}

export function AffectedServersPanel({ servers, onServerClick }: AffectedServersPanelProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">Affected Servers</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Infrastructure implicated in this incident</p>
      </div>

      <ul>
        {servers.map((ref) => (
          <li key={ref.server.id}>
            <button
              type="button"
              onClick={() => onServerClick(ref)}
              className="flex w-full items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--page-background)]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <ServerHealthIndicator status={ref.server.status} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--foreground)]">{ref.server.hostname}</p>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                    {ref.server.service} · {ref.server.environment}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    ref.role === 'Primary' ? 'bg-[var(--active-nav-bg)] text-[var(--primary)]' : 'bg-[var(--page-background)] text-[var(--muted-foreground)]'
                  }`}
                >
                  {ref.role}
                </span>
                <ChevronRight size={14} className="text-[var(--muted-foreground)]" />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
