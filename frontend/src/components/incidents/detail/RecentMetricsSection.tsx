import { ChartCard } from '../../ChartCard'
import { PerformanceLineChart } from '../../servers/detail/PerformanceLineChart'
import type { IncidentDetailBundle } from '../../../data/incidentDetail'

interface RecentMetricsSectionProps {
  metrics: IncidentDetailBundle['metrics']
  primaryServerHostname: string
}

export function RecentMetricsSection({ metrics, primaryServerHostname }: RecentMetricsSectionProps) {
  return (
    <section>
      <h2 className="text-base font-semibold text-[var(--foreground)]">Recent Metrics</h2>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">Last 24 hours on {primaryServerHostname}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <ChartCard title="CPU" description="Last 24 hours">
          <PerformanceLineChart data={metrics.cpu} color="#0078D4" unit="%" gradientId="incident-cpu" />
        </ChartCard>
        <ChartCard title="Memory" description="Last 24 hours">
          <PerformanceLineChart data={metrics.memory} color="#7C3AED" unit="%" gradientId="incident-memory" />
        </ChartCard>
        <ChartCard title="Network" description="Throughput, last 24 hours">
          <PerformanceLineChart data={metrics.network} color="#10B981" unit=" Mbps" gradientId="incident-network" />
        </ChartCard>
      </div>
    </section>
  )
}
