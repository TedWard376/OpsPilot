import { TrendingUp, TrendingDown, Heart, Activity, AlertTriangle, Zap, Shield, AlertCircle } from 'lucide-react'
import type { MetricData } from '../data/dashboard'

interface MetricCardProps {
  metric: MetricData
}

const iconMap = {
  heart: Heart,
  server: Activity,
  alert: AlertCircle,
  warning: AlertTriangle,
  zap: Zap,
  shield: Shield,
}

const statusColors = {
  healthy: 'text-green-600',
  warning: 'text-amber-600',
  critical: 'text-red-600',
}

const statusBgColors = {
  healthy: 'bg-green-50',
  warning: 'bg-amber-50',
  critical: 'bg-red-50',
}

export function MetricCard({ metric }: MetricCardProps) {
  const Icon = iconMap[metric.icon]
  const statusColor = statusColors[metric.status]
  const statusBgColor = statusBgColors[metric.status]

  return (
    <div className="flex h-full min-h-[126px] flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{metric.label}</p>
          <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{metric.value}</p>
        </div>
        <div className={`shrink-0 rounded-lg p-2.5 ${statusBgColor}`}>
          <Icon className={`h-4 w-4 ${statusColor}`} />
        </div>
      </div>

      {metric.trend !== undefined && (
        <div className="mt-4 flex items-center gap-1.5">
          {metric.trend > 0 ? (
            <TrendingUp className="h-3.5 w-3.5 text-green-600" />
          ) : metric.trend < 0 ? (
            <TrendingDown className="h-3.5 w-3.5 text-red-600" />
          ) : (
            <div className="h-3.5 w-3.5" />
          )}
          <span className={`text-xs font-medium ${metric.trend > 0 ? 'text-green-600' : metric.trend < 0 ? 'text-red-600' : 'text-[var(--muted-foreground)]'}`}>
            {metric.trend > 0 ? '+' : ''}{metric.trend}
            {metric.trend === 142 ? ' jobs run' : metric.trend === 3 ? ' vs yesterday' : metric.trend === 2 || metric.trend === -2 ? ' vs yesterday' : ' this hour'}
          </span>
        </div>
      )}
    </div>
  )
}
