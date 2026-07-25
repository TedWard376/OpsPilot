import { MessageSquarePlus, Share2, ShieldCheck, Sparkles, UserPlus } from 'lucide-react'
import type { IncidentItem } from '../../../data/incidents'
import { DetailField } from '../../servers/detail/DetailField'
import { IncidentStatusBadge } from '../IncidentStatusBadge'
import { PriorityBadge } from '../PriorityBadge'

interface IncidentDetailHeaderProps {
  incident: IncidentItem
  onAddNote: () => void
  onInvestigate: () => void
  onResolve: () => void
  onReassign: () => void
  onEscalate: () => void
  isResolved: boolean
  canResolve: boolean
}

export function IncidentDetailHeader({
  incident,
  onAddNote,
  onInvestigate,
  onResolve,
  onReassign,
  onEscalate,
  isResolved,
  canResolve,
}: IncidentDetailHeaderProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-semibold text-blue-600">{incident.id}</span>
            <PriorityBadge priority={incident.priority} />
            <IncidentStatusBadge status={incident.status} />
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{incident.title}</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Affecting {incident.affectedSystems.join(', ')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAddNote}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
          >
            <MessageSquarePlus size={14} />
            Add Note
          </button>
          <button
            type="button"
            onClick={onReassign}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
          >
            <UserPlus size={14} />
            Reassign
          </button>
          <button
            type="button"
            onClick={onEscalate}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
          >
            <Share2 size={14} />
            Escalate
          </button>
          <button
            type="button"
            onClick={onResolve}
            disabled={!canResolve}
            title={!isResolved && !canResolve ? 'Complete every timeline stage before resolving' : undefined}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShieldCheck size={14} />
            {isResolved ? 'Resolved' : 'Resolve Incident'}
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
        <DetailField label="Status" value={incident.status} />
        <DetailField label="Priority" value={incident.priority} />
        <DetailField label="Assigned Engineer" value={incident.assignedEngineer} />
        <DetailField label="Created" value={incident.createdAt} />
        <DetailField label="Last Updated" value={incident.updatedAt} />
        <DetailField label="Duration" value={incident.duration} />
      </dl>
    </div>
  )
}
