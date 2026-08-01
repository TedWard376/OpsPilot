import { ChartCard } from '../ChartCard'
import { PerformanceLineChart } from '../servers/detail/PerformanceLineChart'
import type { TrendPoint } from '../../types/reports'

interface AvailabilityChartProps {
  data: TrendPoint[]
}

export function AvailabilityChart({ data }: AvailabilityChartProps) {
  const series = data.map((point) => ({ time: point.month, value: point.value }))
  const values = data.map((point) => point.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const padding = Math.max(0.05, (maxValue - minValue) * 0.35)
  const domain: [number, number] = [
    Number(Math.max(0, minValue - padding).toFixed(2)),
    Number(Math.min(100, maxValue + padding).toFixed(2)),
  ]

  return (
    <ChartCard title="Infrastructure Availability" description="Average uptime per month">
      <PerformanceLineChart
        data={series}
        color="#10B981"
        unit="%"
        gradientId="reports-availability"
        height={220}
        domain={domain}
      />
    </ChartCard>
  )
}
