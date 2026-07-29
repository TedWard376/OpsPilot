import { Activity, Cpu, HardDrive, MemoryStick, Server } from 'lucide-react'
import type { AlertHealthSummary } from '../../../types/alertDetail'
import { HealthMetricCard, type HealthMetricTone } from '../../servers/detail/HealthMetricCard'

interface AlertHealthSummarySectionProps {
  summary: AlertHealthSummary
}

function toneForValue(value: number): HealthMetricTone {
  if (value >= 85) return 'critical'
  if (value >= 65) return 'warning'
  return 'healthy'
}

const serviceStatusTone: Record<AlertHealthSummary['serviceStatus'], HealthMetricTone> = {
  Running: 'healthy',
  Degraded: 'warning',
  Stopped: 'critical',
}

export function AlertHealthSummarySection({ summary }: AlertHealthSummarySectionProps) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      <HealthMetricCard label="Current CPU" value={`${summary.cpu}%`} icon={Cpu} tone={toneForValue(summary.cpu)} />
      <HealthMetricCard label="Memory" value={`${summary.memory}%`} icon={MemoryStick} tone={toneForValue(summary.memory)} />
      <HealthMetricCard label="Disk" value={`${summary.disk}%`} icon={HardDrive} tone={toneForValue(summary.disk)} />
      <HealthMetricCard label="Network" value={`${summary.networkThroughputMbps} Mbps`} icon={Activity} tone="neutral" />
      <HealthMetricCard
        label="Service Status"
        value={summary.serviceStatus}
        icon={Server}
        tone={serviceStatusTone[summary.serviceStatus]}
        caption={summary.serviceName}
      />
    </section>
  )
}
