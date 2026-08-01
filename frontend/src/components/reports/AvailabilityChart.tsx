import { ChartCard } from '../ChartCard'
import { PerformanceLineChart } from '../servers/detail/PerformanceLineChart'
import type { TrendPoint } from '../../types/reports'

interface AvailabilityChartProps {
  data: TrendPoint[]
}

export function AvailabilityChart({ data }: AvailabilityChartProps) {
  const series = data.map((point) => ({ time: point.month, value: point.value }))

  return (
    <ChartCard title="Infrastructure Availability" description="Average uptime per month">
      <PerformanceLineChart data={series} color="#10B981" unit="%" gradientId="reports-availability" height={220} />
    </ChartCard>
  )
}
