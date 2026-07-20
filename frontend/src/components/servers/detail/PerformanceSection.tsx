import { ChartCard } from '../../ChartCard'
import type { ServerDetailBundle } from '../../../data/serverDetail'
import { PerformanceLineChart } from './PerformanceLineChart'

interface PerformanceSectionProps {
  performance: ServerDetailBundle['performance']
}

export function PerformanceSection({ performance }: PerformanceSectionProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <ChartCard title="CPU" description="Last 24 hours">
        <PerformanceLineChart data={performance.cpu} color="#0078D4" unit="%" gradientId="perf-cpu" />
      </ChartCard>
      <ChartCard title="Memory" description="Last 24 hours">
        <PerformanceLineChart data={performance.memory} color="#7C3AED" unit="%" gradientId="perf-memory" />
      </ChartCard>
      <ChartCard title="Disk" description="Last 24 hours">
        <PerformanceLineChart data={performance.disk} color="#F59E0B" unit="%" gradientId="perf-disk" />
      </ChartCard>
      <ChartCard title="Network" description="Throughput, last 24 hours">
        <PerformanceLineChart data={performance.network} color="#10B981" unit=" Mbps" gradientId="perf-network" />
      </ChartCard>
    </section>
  )
}
