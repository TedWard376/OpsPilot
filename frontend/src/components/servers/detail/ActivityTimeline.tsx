import { AlertTriangle, DatabaseBackup, LifeBuoy, RotateCw, TrendingUp, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TimelineEvent, TimelineEventType } from '../../../data/serverDetail'

interface ActivityTimelineProps {
  events: TimelineEvent[]
}

const typeConfig: Record<TimelineEventType, { icon: LucideIcon; color: string; bg: string }> = {
  alert: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  metric: { icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  backup: { icon: DatabaseBackup, color: 'text-green-600', bg: 'bg-green-50' },
  update: { icon: Wrench, color: 'text-purple-600', bg: 'bg-purple-50' },
  incident: { icon: LifeBuoy, color: 'text-red-600', bg: 'bg-red-50' },
  service: { icon: RotateCw, color: 'text-slate-600', bg: 'bg-slate-50' },
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <h2 className="text-base font-semibold text-[var(--foreground)]">Activity Timeline</h2>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">What happened leading up to now</p>

      <ol className="mt-5 space-y-5">
        {events.map((event, index) => {
          const config = typeConfig[event.type]
          const Icon = config.icon
          return (
            <li key={event.id} className="relative flex gap-3">
              <div className="flex flex-col items-center">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </span>
                {index < events.length - 1 && <span className="mt-1 w-px flex-1 bg-[var(--border)]" />}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--foreground)]">{event.title}</p>
                  <span className="text-xs text-[var(--muted-foreground)]">· {event.timestamp}</span>
                </div>
                <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">{event.description}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
