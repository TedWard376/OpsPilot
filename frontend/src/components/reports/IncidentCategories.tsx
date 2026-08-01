import { Cpu, Database, HardDrive, Network, Shield, Archive } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ChartCard } from '../ChartCard'
import { DistributionBar } from './DistributionBar'
import type { IncidentCategory, IncidentCategoryItem } from '../../types/reports'

interface IncidentCategoriesProps {
  data: IncidentCategoryItem[]
}

const categoryIcons: Record<IncidentCategory, LucideIcon> = {
  Network: Network,
  Compute: Cpu,
  Storage: HardDrive,
  Security: Shield,
  Backup: Archive,
  Database: Database,
}

export function IncidentCategories({ data }: IncidentCategoriesProps) {
  const maxCount = Math.max(1, ...data.map((item) => item.count))

  return (
    <ChartCard title="Incident Categories" description="Incidents grouped by affected system category">
      <div className="space-y-4">
        {data.map((item) => {
          const Icon = categoryIcons[item.category]
          return (
            <DistributionBar
              key={item.category}
              label={item.category}
              count={item.count}
              maxCount={maxCount}
              colorClassName="bg-[var(--primary)]"
              icon={<Icon size={13} className="text-[var(--muted-foreground)]" />}
            />
          )
        })}
      </div>
    </ChartCard>
  )
}
