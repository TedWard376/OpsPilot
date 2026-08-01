import { ChartCard } from '../ChartCard'
import { DistributionBar } from './DistributionBar'
import type { SeverityDistributionItem } from '../../types/reports'

interface SeverityDistributionProps {
  data: SeverityDistributionItem[]
}

const severityColors: Record<SeverityDistributionItem['severity'], string> = {
  Critical: 'bg-red-500',
  High: 'bg-orange-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-blue-500',
}

export function SeverityDistribution({ data }: SeverityDistributionProps) {
  const maxCount = Math.max(1, ...data.map((item) => item.count))

  return (
    <ChartCard title="Alert Severity Distribution" description="Alerts by severity for the selected period">
      <div className="space-y-4">
        {data.map((item) => (
          <DistributionBar key={item.severity} label={item.severity} count={item.count} maxCount={maxCount} colorClassName={severityColors[item.severity]} />
        ))}
      </div>
    </ChartCard>
  )
}
