import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  icon: LucideIcon
  /** Percent change vs. the prior period of equal length. Undefined when there's no prior period to compare against. */
  changePercent?: number
  /** Whether an increase is a good or bad thing for this metric — flips the arrow's colour. */
  trendDirection: 'up-is-good' | 'down-is-good'
}

export function MetricCard({ label, value, icon: Icon, changePercent, trendDirection }: MetricCardProps) {
  const hasChange = changePercent !== undefined && Number.isFinite(changePercent)
  const isFlat = hasChange && Math.round(changePercent!) === 0
  const isIncrease = hasChange && changePercent! > 0

  const isGood = hasChange && (trendDirection === 'up-is-good' ? isIncrease : !isIncrease) && !isFlat
  const trendColor = isFlat ? 'text-[var(--muted-foreground)]' : isGood ? 'text-green-600' : 'text-red-600'
  const TrendIcon = isFlat ? Minus : isIncrease ? TrendingUp : TrendingDown

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
        <Icon size={15} />
        <p className="text-xs font-medium">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{value}</p>
      {hasChange && (
        <p className={`mt-1.5 inline-flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon size={12} />
          {Math.abs(changePercent!).toFixed(1)}% vs. prior period
        </p>
      )}
    </div>
  )
}
