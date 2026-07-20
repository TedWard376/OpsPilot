import { FileText, PlayCircle, RotateCw, Sparkles } from 'lucide-react'
import type { ServerItem } from '../../../data/servers'
import { ServerHealthIndicator } from '../ServerHealthIndicator'
import { ServerStatusBadge } from '../ServerStatusBadge'
import { DetailField } from './DetailField'

interface ServerDetailHeaderProps {
  server: ServerItem
  uptime: string
  assignedTeam: string
  onViewLogs: () => void
  onOpenIncident: () => void
  onRestart: () => void
  onInvestigate: () => void
}

export function ServerDetailHeader({
  server,
  uptime,
  assignedTeam,
  onViewLogs,
  onOpenIncident,
  onRestart,
  onInvestigate,
}: ServerDetailHeaderProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <ServerHealthIndicator status={server.status} size="md" />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">{server.hostname}</h1>
              <ServerStatusBadge status={server.status} />
            </div>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {server.service} service · {server.environment} · {server.os}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onViewLogs}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
          >
            <FileText size={14} />
            View Logs
          </button>
          <button
            type="button"
            onClick={onOpenIncident}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
          >
            <PlayCircle size={14} />
            Open Incident
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
          >
            <RotateCw size={14} />
            Restart
          </button>
          <button
            type="button"
            onClick={onInvestigate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Sparkles size={14} />
            AI Investigate
          </button>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4 sm:grid-cols-3 lg:grid-cols-6">
        <DetailField label="Uptime" value={uptime} />
        <DetailField label="IP Address" value={server.ipAddress} />
        <DetailField label="Location" value={server.location} />
        <DetailField label="Environment" value={server.environment} />
        <DetailField label="Assigned Team" value={assignedTeam} />
        <DetailField label="Last Seen" value={server.lastSeen} />
      </dl>
    </div>
  )
}
