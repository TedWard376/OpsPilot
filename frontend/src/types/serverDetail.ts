import type { TimeSeriesPoint } from './chart'

export type ServiceStatus = 'Running' | 'Degraded' | 'Stopped'

export interface RunningServiceItem {
  id: string
  name: string
  status: ServiceStatus
  cpu: number
  memory: number
  lastRestart: string
  port: number
}

/**
 * Renamed from `AlertSeverity`/`AlertStatus` (the original name in
 * data/serverDetail.ts). Kept scoped to servers because it uses a different
 * casing convention (lowercase values) than the top-level Alerts feature's
 * `AlertSeverity`/`AlertStatus` (Capitalized) — merging them would have
 * silently changed the values one of the two features renders.
 */
export type ServerAlertSeverity = 'critical' | 'high' | 'medium' | 'low'
export type ServerAlertStatus = 'open' | 'investigating' | 'acknowledged' | 'resolved'

export interface ServerAlertItem {
  id: string
  severity: ServerAlertSeverity
  title: string
  timestamp: string
  status: ServerAlertStatus
}

/** Renamed from `IncidentPriority`/`IncidentStatus` for the same reason as ServerAlertSeverity above — kept distinct from the top-level Incident Management feature's types. */
export type ServerIncidentPriority = 'critical' | 'high' | 'medium' | 'low'
export type ServerIncidentStatus = 'open' | 'investigating' | 'resolved'

export interface ServerIncidentItem {
  id: string
  title: string
  priority: ServerIncidentPriority
  status: ServerIncidentStatus
  engineer: string
  createdAt: string
}

export interface AIInvestigationData {
  summary: string
  observations: string[]
  rootCauses: string[]
  recommendedSteps: string[]
  relatedDocs: { title: string; type: string }[]
  similarIncidents: { id: string; title: string; resolvedIn: string }[]
  nextActions: string[]
  lastAnalyzed: string
}

export interface ServerConfiguration {
  cpuCores: number
  ramGb: number
  storageGb: number
  virtualizationPlatform: string
  backupStatus: 'Success' | 'Warning' | 'Failed'
  lastBackup: string
  osVersion: string
  agentVersion: string
}

export type TimelineEventType = 'alert' | 'metric' | 'backup' | 'update' | 'incident' | 'service'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description: string
  timestamp: string
}

export interface ServerHealthSummary {
  healthScore: number
  networkThroughputMbps: number
  runningServicesCount: number
  totalServicesCount: number
  activeAlertsCount: number
}

export interface ServerDetailBundle {
  uptime: string
  assignedTeam: string
  healthSummary: ServerHealthSummary
  performance: {
    cpu: TimeSeriesPoint[]
    memory: TimeSeriesPoint[]
    disk: TimeSeriesPoint[]
    network: TimeSeriesPoint[]
  }
  services: RunningServiceItem[]
  alerts: ServerAlertItem[]
  incidents: ServerIncidentItem[]
  aiInvestigation: AIInvestigationData
  configuration: ServerConfiguration
  timeline: TimelineEvent[]
}
