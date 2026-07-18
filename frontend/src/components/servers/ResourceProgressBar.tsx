function getBarColor(value: number): string {
  if (value > 85) return '#ef4444'
  if (value > 65) return '#f59e0b'
  return '#3b82f6'
}

interface ResourceProgressBarProps {
  value: number
  label: string
}

export function ResourceProgressBar({ value, label }: ResourceProgressBarProps) {
  const color = getBarColor(value)

  return (
    <div className="flex min-w-0 items-center gap-1.5" aria-label={`${label}: ${value}%`}>
      <div className="h-1.5 w-full min-w-[28px] max-w-[48px] shrink rounded-full bg-[var(--border)]">
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="shrink-0 whitespace-nowrap text-[11px] tabular-nums text-[var(--muted-foreground)]">
        {value}%
      </span>
    </div>
  )
}