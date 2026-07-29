import type { ServerItem } from './server'
import type { AIInvestigationData } from './serverDetail'
import type { TimeSeriesPoint } from './chart'

export type TimelineStageState = 'complete' | 'current' | 'pending'

export interface TimelineStage {
  id: string
  label: string
  state: TimelineStageState
  timestamp: string | null
}

export type ActivityLogType = 'status' | 'comment' | 'alert' | 'assignment' | 'system'

export interface ActivityLogEntry {
  id: string
  type: ActivityLogType
  actor: string
  action: string
  timestamp: string
}

export interface InvestigationNote {
  id: string
  author: string
  timestamp: string
  content: string
}

export type AffectedServerRole = 'Primary' | 'Secondary'

export interface AffectedServerRef {
  server: ServerItem
  role: AffectedServerRole
}

export type RelatedAlertSeverity = 'critical' | 'high' | 'medium' | 'low'
export type RelatedAlertStatus = 'open' | 'investigating' | 'acknowledged' | 'resolved'

export interface RelatedAlertRef {
  id: string
  title: string
  severity: RelatedAlertSeverity
  status: RelatedAlertStatus
  timestamp: string
  source: string
}

export interface ResolutionInfo {
  isResolved: boolean
  rootCause: string
  resolutionSummary: string
  resolvedBy: string | null
  resolvedAt: string | null
}

export interface IncidentDetailBundle {
  timeline: TimelineStage[]
  activityLog: ActivityLogEntry[]
  notes: InvestigationNote[]
  affectedServers: AffectedServerRef[]
  relatedAlerts: RelatedAlertRef[]
  metrics: {
    cpu: TimeSeriesPoint[]
    memory: TimeSeriesPoint[]
    network: TimeSeriesPoint[]
  }
  aiInvestigation: AIInvestigationData
  resolution: ResolutionInfo
}
