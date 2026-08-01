import type { ServerStatus } from './server'

export type ReportSeverity = 'Critical' | 'High' | 'Medium' | 'Low'

export type ReportEnvironment = 'Production' | 'Staging' | 'Development'

export type IncidentCategory = 'Network' | 'Compute' | 'Storage' | 'Security' | 'Backup' | 'Database'

/** Reuses ServerStatus — health status values are identical across the app. */
export type HealthStatus = ServerStatus

export type DateRangeOption = '3m' | '6m' | '12m'

export interface ReportFilters {
  dateRange: DateRangeOption
  severity: ReportSeverity | 'All'
  environment: ReportEnvironment | 'All'
  category: IncidentCategory | 'All'
}

export interface KPISummary {
  totalIncidents: number
  mttrHours: number
  criticalAlertsThisMonth: number
  infrastructureAvailability: number
  slaCompliance: number
}

export interface TrendPoint {
  month: string
  value: number
}

export interface SeverityDistributionItem {
  severity: ReportSeverity
  count: number
}

export interface IncidentCategoryItem {
  category: IncidentCategory
  count: number
}

export interface TopAffectedServer {
  hostname: string
  incidents: number
  alerts: number
  healthStatus: HealthStatus
}

export interface AIInsight {
  id: string
  title: string
  description: string
}

export interface ReportData {
  kpis: KPISummary
  /** Same-length prior period, used to derive each MetricCard's trend arrow. Null if the range would run before the mock data starts. */
  previousKpis: KPISummary | null
  incidentTrend: TrendPoint[]
  availabilityTrend: TrendPoint[]
  severityDistribution: SeverityDistributionItem[]
  incidentCategories: IncidentCategoryItem[]
  topServers: TopAffectedServer[]
  aiInsights: AIInsight[]
}
