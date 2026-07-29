import { ChartCard } from '../../ChartCard'
import { PerformanceLineChart } from '../../servers/detail/PerformanceLineChart'
import type { AlertDetailBundle } from '../../../types/alertDetail'

interface AlertMetricGraphsSectionProps {
  metrics: AlertDetailBundle['metrics']
}

export function AlertMetricGraphsSection({ metrics }: AlertMetricGraphsSectionProps) {
  return (
    <section>
      <h2 className="text-base font-semibold text-[var(--foreground)]">Metric Graphs</h2>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">Last 24 hours on the affected server</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="CPU" description="Last 24 hours">
          <PerformanceLineChart data={metrics.cpu} color="#0078D4" unit="%" gradientId="alert-cpu" />
        </ChartCard>
        <ChartCard title="Memory" description="Last 24 hours">
          <PerformanceLineChart data={metrics.memory} color="#7C3AED" unit="%" gradientId="alert-memory" />
        </ChartCard>
        <ChartCard title="Disk" description="Last 24 hours">
          <PerformanceLineChart data={metrics.disk} color="#F59E0B" unit="%" gradientId="alert-disk" />
        </ChartCard>
        <ChartCard title="Network" description="Throughput, last 24 hours">
          <PerformanceLineChart data={metrics.network} color="#10B981" unit=" Mbps" gradientId="alert-network" />
        </ChartCard>
      </div>
    </section>
  )
}
