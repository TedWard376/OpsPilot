import { CheckCircle2, PlayCircle, Sparkles, UserPlus } from 'lucide-react'
import type { AlertItem } from '../../../types/alert'
import { SeverityBadge } from '../SeverityBadge'
import { AlertStatusBadge } from '../AlertStatusBadge'
import { DetailField } from '../../servers/detail/DetailField'

interface AlertDetailHeaderProps {
  alert: AlertItem
  assignedEngineer: string | null
  canAcknowledge: boolean
  isAcknowledged: boolean
  onAcknowledge: () => void
  onCreateIncident: () => void
  onAssignEngineer: () => void
  onInvestigate: () => void
}

export function AlertDetailHeader({
  alert,
  assignedEngineer,
  canAcknowledge,
  isAcknowledged,
  onAcknowledge,
  onCreateIncident,
  onAssignEngineer,
  onInvestigate,
}: AlertDetailHeaderProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-semibold text-blue-600">{alert.id}</span>
            <SeverityBadge severity={alert.severity} />
            <AlertStatusBadge status={alert.status} />
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{alert.name}</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {alert.affectedServerHostname} · {alert.environment} · via {alert.source}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAcknowledge}
            disabled={!canAcknowledge}
            title={isAcknowledged ? 'Already acknowledged' : undefined}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 size={14} />
            {isAcknowledged ? 'Acknowledged' : 'Acknowledge'}
          </button>
          <button
            type="button"
            onClick={onAssignEngineer}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
          >
            <UserPlus size={14} />
            Assign Engineer
          </button>
          <button
            type="button"
            onClick={onCreateIncident}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
          >
            <PlayCircle size={14} />
            Create Incident
          </button>
          <button
            type="button"
            onClick={onInvestigate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Sparkles size={14} />
            Investigate with AI
          </button>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4 sm:grid-cols-3 lg:grid-cols-6">
        <DetailField label="Source" value={alert.source} />
        <DetailField label="Trigger Time" value={alert.triggerTime} />
        <DetailField label="Duration" value={alert.duration} />
        <DetailField label="Environment" value={alert.environment} />
        <DetailField label="Affected Server" value={alert.affectedServerHostname} />
        <DetailField label="Assigned Engineer" value={assignedEngineer ?? 'Unassigned'} />
      </dl>
    </div>
  )
}
