import { Filter, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MetricCard } from '../components/MetricCard'
import { SectionHeader } from '../components/SectionHeader'
import { ChartCard } from '../components/ChartCard'
import { AlertTable } from '../components/AlertTable'
import { IncidentTable } from '../components/IncidentTable'
import { RecommendationCard } from '../components/RecommendationCard'
import { SystemStatusPanel } from '../components/SystemStatusPanel'
import { SimpleLineChart } from '../components/SimpleLineChart'
import { SimpleBarChart } from '../components/SimpleBarChart'
import {
  metricsData,
  healthChartData,
  alertsData,
  incidentsData,
  recommendationsData,
  systemStatusData,
} from '../data/dashboard'

const incidentTrendData = [
  { day: 'Mon', critical: 1, high: 1, medium: 0 },
  { day: 'Tue', critical: 0, high: 1, medium: 0 },
  { day: 'Wed', critical: 2, high: 1, medium: 1 },
  { day: 'Thu', critical: 1, high: 0, medium: 1 },
  { day: 'Fri', critical: 0, high: 1, medium: 0 },
  { day: 'Sat', critical: 1, high: 1, medium: 1 },
  { day: 'Sun', critical: 1, high: 0, medium: 1 },
]

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-4 pb-4">
      <section className="flex flex-col gap-3 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Operations Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Monday, 13 July 2026 — 09:45 UTC</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--active-nav-bg)]">
            <Filter size={14} />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white transition-colors hover:opacity-90">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {metricsData.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Infrastructure Health"
          description="Last 24 hours — all regions"
          footer="94% average across the last day"
        >
          <SimpleLineChart data={healthChartData} height={220} />
        </ChartCard>

        <ChartCard
          title="Incident Trend"
          description="Last 7 days by severity"
          footer="Critical and high severity remain elevated"
        >
          <SimpleBarChart data={incidentTrendData} height={220} />
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.85fr]">
        <AlertTable alerts={alertsData} onViewAll={() => navigate('/incidents')} />
        <SystemStatusPanel systems={systemStatusData} />
      </section>

      <section>
        <SectionHeader title="AI Recommendations" description="Suggested actions based on current infrastructure signals." />
        <div className="grid gap-4 xl:grid-cols-3">
          {recommendationsData.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </section>

      <IncidentTable incidents={incidentsData} onViewAll={() => navigate('/incidents')} />
    </div>
  )
}

export default Dashboard
