import { AlertTriangle, MessageCircle, Settings2, UserCog } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ActivityLogEntry, ActivityLogType } from '../../../data/incidentDetail'

interface ActivityLogPanelProps {
  entries: ActivityLogEntry[]
}

const typeConfig: Record<ActivityLogType, { icon: LucideIcon; color: string; bg: string }> = {
  status: { icon: Settings2, color: 'text-blue-600', bg: 'bg-blue-50' },
  comment: { icon: MessageCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
  alert: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  assignment: { icon: UserCog, color: 'text-slate-600', bg: 'bg-slate-50' },
  system: { icon: Settings2, color: 'text-green-600', bg: 'bg-green-50' },
}

export function ActivityLogPanel({ entries }: ActivityLogPanelProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <h2 className="text-base font-semibold text-[var(--foreground)]">Activity Log</h2>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">Full audit trail for this incident</p>

      <ol className="mt-5 space-y-4">
        {entries.map((entry, index) => {
          const config = typeConfig[entry.type]
          const Icon = config.icon
          return (
            <li key={entry.id} className="relative flex gap-3">
              <div className="flex flex-col items-center">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </span>
                {index < entries.length - 1 && <span className="mt-1 w-px flex-1 bg-[var(--border)]" />}
              </div>
              <div className="pb-1">
                <p className="text-sm text-[var(--foreground)]">
                  <span className="font-medium">{entry.actor}</span> {entry.action}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{entry.timestamp}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
