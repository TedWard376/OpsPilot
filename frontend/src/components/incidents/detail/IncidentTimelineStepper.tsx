import { Check } from 'lucide-react'
import type { TimelineStage } from '../../../data/incidentDetail'

interface IncidentTimelineStepperProps {
  stages: TimelineStage[]
}

export function IncidentTimelineStepper({ stages }: IncidentTimelineStepperProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <h2 className="text-base font-semibold text-[var(--foreground)]">Timeline</h2>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">Incident lifecycle progress</p>

      <ol className="mt-6 flex flex-col gap-0 sm:flex-row sm:items-start">
        {stages.map((stage, index) => (
          <li key={stage.id} className="flex flex-1 items-start sm:flex-col">
            <div className="flex items-center sm:w-full">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                  stage.state === 'complete'
                    ? 'border-green-600 bg-green-600 text-white'
                    : stage.state === 'current'
                      ? 'border-[var(--primary)] bg-[var(--card)] text-[var(--primary)]'
                      : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]'
                }`}
              >
                {stage.state === 'complete' ? <Check size={14} /> : index + 1}
              </span>
              {index < stages.length - 1 && (
                <span
                  className={`mx-2 hidden h-0.5 flex-1 sm:block ${stage.state === 'complete' ? 'bg-green-600' : 'bg-[var(--border)]'}`}
                />
              )}
            </div>
            <div className="ml-3 mt-0 sm:ml-0 sm:mt-2">
              <p
                className={`text-sm font-medium ${
                  stage.state === 'pending' ? 'text-[var(--muted-foreground)]' : 'text-[var(--foreground)]'
                }`}
              >
                {stage.label}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">{stage.timestamp ?? 'Pending'}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
