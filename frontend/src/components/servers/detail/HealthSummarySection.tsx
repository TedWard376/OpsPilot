import { Activity, AlertCircle, Cpu, Gauge, HardDrive, MemoryStick, Server } from 'lucide-react'
import type { ServerItem } from '../../../data/servers'
import type { ServerHealthSummary } from '../../../data/serverDetail'
import { HealthMetricCard, type HealthMetricTone } from './HealthMetricCard'

interface HealthSummarySectionProps {
  server: ServerItem
  summary: ServerHealthSummary
}

function toneForValue(value: number): HealthMetricTone {
  if (value >= 85) return 'critical'
  if (value >= 65) return 'warning'
  return 'healthy'
}

export function HealthSummarySection({ server, summary }: HealthSummarySectionProps) {
  const healthTone: HealthMetricTone = summary.healthScore >= 85 ? 'healthy' : summary.healthScore >= 60 ? 'warning' : 'critical'

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
      <HealthMetricCard label="Health Score" value={`${summary.healthScore}%`} icon={Gauge} tone={healthTone} />
      <HealthMetricCard label="CPU Usage" value={`${server.cpu}%`} icon={Cpu} tone={toneForValue(server.cpu)} />
      <HealthMetricCard label="Memory Usage" value={`${server.memory}%`} icon={MemoryStick} tone={toneForValue(server.memory)} />
      <HealthMetricCard label="Disk Usage" value={`${server.disk}%`} icon={HardDrive} tone={toneForValue(server.disk)} />
      <HealthMetricCard label="Network Activity" value={`${summary.networkThroughputMbps} Mbps`} icon={Activity} tone="neutral" />
      <HealthMetricCard
        label="Running Services"
        value={`${summary.runningServicesCount}/${summary.totalServicesCount}`}
        icon={Server}
        tone={summary.runningServicesCount === summary.totalServicesCount ? 'healthy' : 'warning'}
      />
      <HealthMetricCard
        label="Active Alerts"
        value={String(summary.activeAlertsCount)}
        icon={AlertCircle}
        tone={summary.activeAlertsCount === 0 ? 'healthy' : summary.activeAlertsCount >= 2 ? 'critical' : 'warning'}
      />
    </section>
  )
}
