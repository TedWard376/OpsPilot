/**
 * Reports & Analytics access layer.
 *
 * `getReportData(filters)` is where a FastAPI call will go in production —
 * e.g. `GET /api/reports?dateRange=6m&severity=Critical&...` — returning
 * this same `ReportData` shape. Until then, it filters and aggregates the
 * in-memory records from data/reports.ts. No component reads that file
 * directly.
 */

import type {
  AvailabilityRecord,
  AlertRecord,
  IncidentRecord,
} from '../data/reports'
import {
  AI_INSIGHTS,
  ENVIRONMENTS,
  INCIDENT_CATEGORIES,
  REPORT_MONTHS,
  SEVERITIES,
  SLA_TARGET,
  alertRecords,
  availabilityRecords,
  incidentRecords,
  reportServers,
} from '../data/reports'
import type { IncidentCategoryItem, KPISummary, ReportData, ReportFilters, SeverityDistributionItem, TopAffectedServer, TrendPoint } from '../types/reports'

const RANGE_MONTH_COUNTS: Record<ReportFilters['dateRange'], number> = { '3m': 3, '6m': 6, '12m': 12 }

function monthIndexesForRange(dateRange: ReportFilters['dateRange']): number[] {
  const span = RANGE_MONTH_COUNTS[dateRange]
  const start = REPORT_MONTHS.length - span
  return Array.from({ length: span }, (_, i) => start + i)
}

function matchesFilters(environment: string, filters: ReportFilters): boolean {
  return filters.environment === 'All' || environment === filters.environment
}

function filterIncidents(records: IncidentRecord[], monthIndexes: number[], filters: ReportFilters): IncidentRecord[] {
  const monthSet = new Set(monthIndexes)
  return records.filter(
    (r) =>
      monthSet.has(r.monthIndex) &&
      matchesFilters(r.environment, filters) &&
      (filters.severity === 'All' || r.severity === filters.severity) &&
      (filters.category === 'All' || r.category === filters.category),
  )
}

function filterAlerts(records: AlertRecord[], monthIndexes: number[], filters: ReportFilters): AlertRecord[] {
  const monthSet = new Set(monthIndexes)
  return records.filter(
    (r) => monthSet.has(r.monthIndex) && matchesFilters(r.environment, filters) && (filters.severity === 'All' || r.severity === filters.severity),
  )
}

function filterAvailability(records: AvailabilityRecord[], monthIndexes: number[], filters: ReportFilters): AvailabilityRecord[] {
  const monthSet = new Set(monthIndexes)
  return records.filter((r) => monthSet.has(r.monthIndex) && matchesFilters(r.environment, filters))
}

function computeKPIs(monthIndexes: number[], filters: ReportFilters): KPISummary {
  const filteredIncidents = filterIncidents(incidentRecords, monthIndexes, filters)
  const filteredAlerts = filterAlerts(alertRecords, monthIndexes, filters)
  const filteredAvailability = filterAvailability(availabilityRecords, monthIndexes, filters)

  const mttrHours = filteredIncidents.length
    ? Math.round((filteredIncidents.reduce((sum, r) => sum + r.resolutionHours, 0) / filteredIncidents.length) * 10) / 10
    : 0

  const currentMonthIndex = monthIndexes[monthIndexes.length - 1]
  const criticalAlertsThisMonth = filteredAlerts.filter((r) => r.monthIndex === currentMonthIndex && r.severity === 'Critical').length

  const infrastructureAvailability = filteredAvailability.length
    ? Math.round((filteredAvailability.reduce((sum, r) => sum + r.availability, 0) / filteredAvailability.length) * 100) / 100
    : 0

  const slaCompliance = filteredAvailability.length
    ? Math.round((filteredAvailability.filter((r) => r.availability >= SLA_TARGET).length / filteredAvailability.length) * 1000) / 10
    : 0

  return {
    totalIncidents: filteredIncidents.length,
    mttrHours,
    criticalAlertsThisMonth,
    infrastructureAvailability,
    slaCompliance,
  }
}

export function getReportData(filters: ReportFilters): ReportData {
  const monthIndexes = monthIndexesForRange(filters.dateRange)
  const span = monthIndexes.length
  const previousStart = monthIndexes[0] - span
  const previousMonthIndexes = previousStart >= 0 ? Array.from({ length: span }, (_, i) => previousStart + i) : []

  const kpis = computeKPIs(monthIndexes, filters)
  const previousKpis = previousMonthIndexes.length ? computeKPIs(previousMonthIndexes, filters) : null

  const incidentTrend: TrendPoint[] = monthIndexes.map((monthIndex) => ({
    month: REPORT_MONTHS[monthIndex].split(' ')[0],
    value: filterIncidents(incidentRecords, [monthIndex], filters).length,
  }))

  const availabilityTrend: TrendPoint[] = monthIndexes.map((monthIndex) => {
    const rows = filterAvailability(availabilityRecords, [monthIndex], filters)
    const average = rows.length ? rows.reduce((sum, r) => sum + r.availability, 0) / rows.length : 0
    return { month: REPORT_MONTHS[monthIndex].split(' ')[0], value: Math.round(average * 100) / 100 }
  })

  const filteredAlertsForDistribution = filterAlerts(alertRecords, monthIndexes, filters)
  const severityDistribution: SeverityDistributionItem[] = SEVERITIES.map((severity) => ({
    severity,
    count: filteredAlertsForDistribution.filter((r) => r.severity === severity).length,
  }))

  const filteredIncidentsForCategories = filterIncidents(incidentRecords, monthIndexes, filters)
  const incidentCategories: IncidentCategoryItem[] = INCIDENT_CATEGORIES.map((category) => ({
    category,
    count: filteredIncidentsForCategories.filter((r) => r.category === category).length,
  }))

  const serverStats = new Map<string, { incidents: number; alerts: number }>()
  filteredIncidentsForCategories.forEach((r) => {
    const stats = serverStats.get(r.hostname) ?? { incidents: 0, alerts: 0 }
    stats.incidents += 1
    serverStats.set(r.hostname, stats)
  })
  filteredAlertsForDistribution.forEach((r) => {
    const stats = serverStats.get(r.hostname) ?? { incidents: 0, alerts: 0 }
    stats.alerts += 1
    serverStats.set(r.hostname, stats)
  })

  const topServers: TopAffectedServer[] = Array.from(serverStats.entries())
    .map(([hostname, stats]) => ({
      hostname,
      incidents: stats.incidents,
      alerts: stats.alerts,
      healthStatus: reportServers.find((s) => s.hostname === hostname)?.health ?? 'Healthy',
    }))
    .sort((a, b) => b.incidents + b.alerts - (a.incidents + a.alerts))
    .slice(0, 6)

  return {
    kpis,
    previousKpis,
    incidentTrend,
    availabilityTrend,
    severityDistribution,
    incidentCategories,
    topServers,
    aiInsights: AI_INSIGHTS,
  }
}

export function getReportEnvironments(): typeof ENVIRONMENTS {
  return ENVIRONMENTS
}

export function getReportSeverities(): typeof SEVERITIES {
  return SEVERITIES
}

export function getReportCategories(): typeof INCIDENT_CATEGORIES {
  return INCIDENT_CATEGORIES
}
