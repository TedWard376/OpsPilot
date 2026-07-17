/**
 * HealthRing Component
 * Presentational component that displays system health as a circular progress indicator:
 * - Animated progress ring
 * - Central percentage display
 * - Status label below
 * - Responsive sizing
 */

interface HealthRingProps {
  percentage: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeConfig = {
  sm: { size: 80, strokeWidth: 6, fontSize: 24 },
  md: { size: 120, strokeWidth: 8, fontSize: 32 },
  lg: { size: 160, strokeWidth: 10, fontSize: 40 },
}

export function HealthRing({ percentage, size = 'md', label = 'Health Status' }: HealthRingProps) {
  const config = sizeConfig[size]
  const radius = (config.size - config.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  // Determine color based on percentage
  let color = 'text-green-600'
  if (percentage < 70) color = 'text-red-600'
  else if (percentage < 85) color = 'text-yellow-600'

  const bgColor = percentage < 70 ? 'bg-red-50' : percentage < 85 ? 'bg-yellow-50' : 'bg-green-50'

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`flex items-center justify-center rounded-full ${bgColor} p-6`}>
        <svg width={config.size} height={config.size} viewBox={`0 0 ${config.size} ${config.size}`}>
          {/* Background circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={config.strokeWidth}
          />

          {/* Progress circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-500 ${color}`}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: `${config.size / 2}px ${config.size / 2}px`,
            }}
          />

          {/* Text in center */}
          <text
            x={config.size / 2}
            y={config.size / 2 + config.fontSize / 3}
            textAnchor="middle"
            className={`font-bold ${color}`}
            fontSize={config.fontSize}
          >
            {Math.round(percentage)}%
          </text>
        </svg>
      </div>

      {label && <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>}
    </div>
  )
}
