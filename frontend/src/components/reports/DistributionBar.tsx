import type { ReactNode } from 'react'

interface DistributionBarProps {
  label: string
  count: number
  maxCount: number
  colorClassName: string
  icon?: ReactNode
}

export function DistributionBar({ label, count, maxCount, colorClassName, icon }: DistributionBarProps) {
  const widthPercent = maxCount > 0 ? Math.max(4, Math.round((count / maxCount) * 100)) : 0

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
          {icon}
          {label}
        </span>
        <span className="text-[var(--muted-foreground)]">{count}</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--page-background)]">
        <div className={`h-full rounded-full ${colorClassName}`} style={{ width: `${widthPercent}%` }} />
      </div>
    </div>
  )
}
