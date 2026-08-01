import { useMemo } from 'react'
import { AlertTriangle, Clock3, Gauge, LifeBuoy, ShieldCheck } from 'lucide-react'
import { getReportCategories, getReportData, getReportEnvironments, getReportSeverities } from '../services/reportsService'
import { useReportFilters } from '../hooks/useReportFilters'
import { MetricCard } from '../components/reports/MetricCard'
import { Filters } from '../components/reports/Filters'
import { IncidentTrendChart } from '../components/reports/IncidentTrendChart'
import { AvailabilityChart } from '../components/reports/AvailabilityChart'
import { SeverityDistribution } from '../components/reports/SeverityDistribution'
import { IncidentCategories } from '../components/reports/IncidentCategories'
import { TopServersTable } from '../components/reports/TopServersTable'
import { AIInsightsPanel } from '../components/reports/AIInsightsPanel'

function percentChange(current: number, previous: number): number | undefined {
  if (previous === 0) return undefined
  return ((current - previous) / previous) * 100
}

function Reports() {
  const { filters, setDateRange, setSeverity, setEnvironment, setCategory, resetFilters, isFiltered } = useReportFilters()

  const environments = useMemo(() => getReportEnvironments(), [])
  const severities = useMemo(() => getReportSeverities(), [])
  const categories = useMemo(() => getReportCategories(), [])

  // In production this becomes `useReportData(filters)` backed by
  // `GET /api/reports?...`.
  const report = useMemo(() => getReportData(filters), [filters])
  const { kpis, previousKpis } = report

  return (
    <div className="space-y-5 pb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Operational health, reliability, and performance trends across your infrastructure</p>
      </div>

      <Filters
        filters={filters}
        environments={environments}
        severities={severities}
        categories={categories}
        onDateRangeChange={setDateRange}
        onSeverityChange={setSeverity}
        onEnvironmentChange={setEnvironment}
        onCategoryChange={setCategory}
        onReset={resetFilters}
        isFiltered={isFiltered}
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Total Incidents"
          value={String(kpis.totalIncidents)}
          icon={LifeBuoy}
          trendDirection="down-is-good"
          changePercent={previousKpis ? percentChange(kpis.totalIncidents, previousKpis.totalIncidents) : undefined}
        />
        <MetricCard
          label="Mean Time to Resolution"
          value={`${kpis.mttrHours}h`}
          icon={Clock3}
          trendDirection="down-is-good"
          changePercent={previousKpis ? percentChange(kpis.mttrHours, previousKpis.mttrHours) : undefined}
        />
        <MetricCard
          label="Critical Alerts This Month"
          value={String(kpis.criticalAlertsThisMonth)}
          icon={AlertTriangle}
          trendDirection="down-is-good"
          changePercent={previousKpis ? percentChange(kpis.criticalAlertsThisMonth, previousKpis.criticalAlertsThisMonth) : undefined}
        />
        <MetricCard
          label="Infrastructure Availability"
          value={`${kpis.infrastructureAvailability}%`}
          icon={Gauge}
          trendDirection="up-is-good"
          changePercent={previousKpis ? percentChange(kpis.infrastructureAvailability, previousKpis.infrastructureAvailability) : undefined}
        />
        <MetricCard
          label="SLA Compliance"
          value={`${kpis.slaCompliance}%`}
          icon={ShieldCheck}
          trendDirection="up-is-good"
          changePercent={previousKpis ? percentChange(kpis.slaCompliance, previousKpis.slaCompliance) : undefined}
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <IncidentTrendChart data={report.incidentTrend} />
        <AvailabilityChart data={report.availabilityTrend} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SeverityDistribution data={report.severityDistribution} />
        <IncidentCategories data={report.incidentCategories} />
      </div>

      <TopServersTable servers={report.topServers} />

      <AIInsightsPanel insights={report.aiInsights} />
    </div>
  )
}

export default Reports
