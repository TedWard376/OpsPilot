/**
 * Mock data for the Reports & Analytics feature.
 *
 * Rather than hand-writing pre-aggregated numbers, this generates granular
 * "raw telemetry" records (individual incidents/alerts, tagged with month,
 * severity, environment, category, and server) using the same deterministic
 * seeded-generator pattern as the rest of the app (utils/mockDataGenerators).
 * services/reportsService.ts then filters and aggregates these records —
 * which is what makes the Reports page's filters do real work instead of
 * just re-labelling static numbers.
 */

import { clamp, hashCode, pick } from '../utils/mockDataGenerators'
import type { HealthStatus, IncidentCategory, ReportEnvironment, ReportSeverity, AIInsight } from '../types/reports'

export const REPORT_MONTHS = [
  'Aug 2025',
  'Sep 2025',
  'Oct 2025',
  'Nov 2025',
  'Dec 2025',
  'Jan 2026',
  'Feb 2026',
  'Mar 2026',
  'Apr 2026',
  'May 2026',
  'Jun 2026',
  'Jul 2026',
] as const

export const SEVERITIES: ReportSeverity[] = ['Critical', 'High', 'Medium', 'Low']
export const ENVIRONMENTS: ReportEnvironment[] = ['Production', 'Staging', 'Development']
export const INCIDENT_CATEGORIES: IncidentCategory[] = ['Network', 'Compute', 'Storage', 'Security', 'Backup', 'Database']

export const SLA_TARGET = 99.9

/** Real hostnames from the server inventory, each with a fixed current health status for the Top Affected Servers table. */
const REPORT_SERVERS: { hostname: string; health: HealthStatus }[] = [
  { hostname: 'prod-db-01', health: 'Critical' },
  { hostname: 'prod-api-01', health: 'Warning' },
  { hostname: 'prod-cache-01', health: 'Warning' },
  { hostname: 'prod-monitor-01', health: 'Warning' },
  { hostname: 'prod-worker-01', health: 'Warning' },
  { hostname: 'prod-web-01', health: 'Healthy' },
  { hostname: 'prod-web-02', health: 'Healthy' },
  { hostname: 'prod-auth-01', health: 'Healthy' },
  { hostname: 'prod-storage-01', health: 'Healthy' },
  { hostname: 'prod-k8s-01', health: 'Healthy' },
]

export interface IncidentRecord {
  id: string
  monthIndex: number
  severity: ReportSeverity
  environment: ReportEnvironment
  category: IncidentCategory
  hostname: string
  resolutionHours: number
}

export interface AlertRecord {
  id: string
  monthIndex: number
  severity: ReportSeverity
  environment: ReportEnvironment
  hostname: string
}

export interface AvailabilityRecord {
  monthIndex: number
  environment: ReportEnvironment
  availability: number
}

function generateIncidentRecords(): IncidentRecord[] {
  const records: IncidentRecord[] = []
  let counter = 1

  REPORT_MONTHS.forEach((_, monthIndex) => {
    const countThisMonth = 8 + (hashCode(`incident-count-${monthIndex}`) % 7) // 8–14 per month
    for (let i = 0; i < countThisMonth; i++) {
      const seed = hashCode(`incident-${monthIndex}-${i}`)
      records.push({
        id: `RPT-INC-${String(counter).padStart(4, '0')}`,
        monthIndex,
        severity: pick(SEVERITIES, seed),
        environment: pick(ENVIRONMENTS, seed + 1),
        category: pick(INCIDENT_CATEGORIES, seed + 2),
        hostname: pick(REPORT_SERVERS, seed + 3).hostname,
        resolutionHours: clamp(1 + (seed % 36), 1, 48),
      })
      counter++
    }
  })

  return records
}

function generateAlertRecords(): AlertRecord[] {
  const records: AlertRecord[] = []
  let counter = 1

  REPORT_MONTHS.forEach((_, monthIndex) => {
    const countThisMonth = 20 + (hashCode(`alert-count-${monthIndex}`) % 16) // 20–35 per month
    for (let i = 0; i < countThisMonth; i++) {
      const seed = hashCode(`alert-${monthIndex}-${i}`)
      records.push({
        id: `RPT-ALT-${String(counter).padStart(4, '0')}`,
        monthIndex,
        severity: pick(SEVERITIES, seed),
        environment: pick(ENVIRONMENTS, seed + 1),
        hostname: pick(REPORT_SERVERS, seed + 2).hostname,
      })
      counter++
    }
  })

  return records
}

function generateAvailabilityRecords(): AvailabilityRecord[] {
  const records: AvailabilityRecord[] = []

  REPORT_MONTHS.forEach((_, monthIndex) => {
    ENVIRONMENTS.forEach((environment) => {
      const seed = hashCode(`availability-${monthIndex}-${environment}`)
      const dip = (seed % 100) / 100
      // Production stays tighter to 100%; lower environments have more headroom to dip.
      const spread = environment === 'Production' ? 0.6 : environment === 'Staging' ? 1.2 : 2.5
      const availability = clamp(99.98 - dip * spread, 95, 99.99)
      records.push({ monthIndex, environment, availability: Math.round(availability * 100) / 100 })
    })
  })

  return records
}

export const incidentRecords: IncidentRecord[] = generateIncidentRecords()
export const alertRecords: AlertRecord[] = generateAlertRecords()
export const availabilityRecords: AvailabilityRecord[] = generateAvailabilityRecords()
export const reportServers = REPORT_SERVERS

export const AI_INSIGHTS: AIInsight[] = [
  {
    id: 'insight-1',
    title: 'Most Unstable Infrastructure',
    description:
      'prod-db-01 accounts for the largest share of Critical incidents over the selected period. Consider a capacity review or a read-replica failover strategy.',
  },
  {
    id: 'insight-2',
    title: 'Recurring Incident Pattern',
    description:
      'Memory-pressure incidents on cache and worker nodes tend to cluster in the first week of each month, correlating with scheduled batch jobs.',
  },
  {
    id: 'insight-3',
    title: 'Recommended Operational Improvement',
    description:
      'Authentication-related alerts have trended down since the last SSO configuration change — the same pattern may be worth applying to the API gateway.',
  },
  {
    id: 'insight-4',
    title: 'Capacity Planning Suggestion',
    description: 'Storage utilization growth on prod-storage-01 suggests it will approach capacity limits within the next few weeks at the current rate.',
  },
]
