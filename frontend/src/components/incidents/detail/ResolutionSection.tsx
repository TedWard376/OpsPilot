import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react'
import type { ResolutionInfo } from '../../../data/incidentDetail'

interface ResolutionSectionProps {
  resolution: ResolutionInfo
  canResolve: boolean
  onMarkResolved: () => void
}

export function ResolutionSection({ resolution, canResolve, onMarkResolved }: ResolutionSectionProps) {
  if (!resolution.isResolved) {
    return (
      <section className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-5 text-center shadow-sm">
        {canResolve ? (
          <>
            <ShieldCheck className="mx-auto h-6 w-6 text-[var(--muted-foreground)]" />
            <h2 className="mt-2 text-base font-semibold text-[var(--foreground)]">Ready to Resolve</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-[var(--muted-foreground)]">
              All investigation stages are complete. Mark this incident resolved to record the outcome.
            </p>
            <button
              type="button"
              onClick={onMarkResolved}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <CheckCircle2 size={14} />
              Mark as Resolved
            </button>
          </>
        ) : (
          <>
            <Clock className="mx-auto h-6 w-6 text-[var(--muted-foreground)]" />
            <h2 className="mt-2 text-base font-semibold text-[var(--foreground)]">Not Yet Resolvable</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-[var(--muted-foreground)]">
              Complete every stage on the timeline above — Detected through Monitoring — before this incident can be resolved.
            </p>
          </>
        )}
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <h2 className="text-base font-semibold text-[var(--foreground)]">Resolution</h2>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Root Cause</h4>
          <p className="mt-1.5 text-sm leading-6 text-[var(--foreground)]">{resolution.rootCause}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Resolution Summary</h4>
          <p className="mt-1.5 text-sm leading-6 text-[var(--foreground)]">{resolution.resolutionSummary}</p>
        </div>
        <div className="flex flex-wrap gap-6 border-t border-[var(--border)] pt-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Resolved By</p>
            <p className="mt-1 font-medium text-[var(--foreground)]">{resolution.resolvedBy}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Resolved At</p>
            <p className="mt-1 font-medium text-[var(--foreground)]">{resolution.resolvedAt}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
