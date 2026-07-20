import type { LucideIcon } from 'lucide-react'

export type HealthMetricTone = 'healthy' | 'warning' | 'critical' | 'neutral'

interface HealthMetricCardProps {
  label: string
  value: string
  icon: LucideIcon
  tone: HealthMetricTone
  caption?: string
}

const toneColor: Record<HealthMetricTone, string> = {
  healthy: 'text-green-600',
  warning: 'text-amber-600',
  critical: 'text-red-600',
  neutral: 'text-[var(--primary)]',
}

const toneBg: Record<HealthMetricTone, string> = {
  healthy: 'bg-green-50',
  warning: 'bg-amber-50',
  critical: 'bg-red-50',
  neutral: 'bg-[var(--active-nav-bg)]',
}

export function HealthMetricCard({ label, value, icon: Icon, tone, caption }: HealthMetricCardProps) {
  return (
    <div className="flex h-full min-h-[110px] flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">{label}</p>
          <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">{value}</p>
        </div>
        <div className={`shrink-0 rounded-lg p-2 ${toneBg[tone]}`}>
          <Icon className={`h-4 w-4 ${toneColor[tone]}`} />
        </div>
      </div>
      {caption && <p className="mt-2 text-xs text-[var(--muted-foreground)]">{caption}</p>}
    </div>
  )
}
