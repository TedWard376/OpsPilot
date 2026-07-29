import type { ServerEnvironment } from './server'
import type { ServiceStatus } from './serverDetail'
import type { IncidentPriority, IncidentStatus } from './incident'
import type { TimeSeriesPoint } from './chart'

/** Point-in-time resource and service health for the alert's affected server. */
export interface AlertHealthSummary {
  cpu: number
  memory: number
  disk: number
  networkThroughputMbps: number
  serviceName: string
  serviceStatus: ServiceStatus
}

/** Identifies exactly where the alert originated within the infrastructure. */
export interface AffectedResource {
  hostname: string
  cluster: string
  environment: ServerEnvironment
  region: string
  ipAddress: string
}

export type AlertTimelineEventType = 'triggered' | 'threshold' | 'acknowledged' | 'incident' | 'resolved'

export interface AlertTimelineEvent {
  id: string
  type: AlertTimelineEventType
  title: string
  description: string
  timestamp: string
}

export type AlertRiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'

/** Placeholder AI investigation content — will be produced by the AI Investigation Assistant once the AI backend is connected. */
export interface AlertAIInvestigation {
  summary: string
  possibleRootCauses: string[]
  likelyImpact: string
  investigationSteps: string[]
  recommendedDocs: { title: string; type: string }[]
  riskLevel: AlertRiskLevel
  riskAssessment: string
  lastAnalyzed: string
}

export interface RelatedIncidentRef {
  id: string
  title: string
  priority: IncidentPriority
  status: IncidentStatus
  engineer: string
  createdAt: string
}

export interface RelatedDocRef {
  title: string
  type: string
  description: string
}

export interface AlertDetailBundle {
  healthSummary: AlertHealthSummary
  affectedResource: AffectedResource
  timeline: AlertTimelineEvent[]
  metrics: {
    cpu: TimeSeriesPoint[]
    memory: TimeSeriesPoint[]
    disk: TimeSeriesPoint[]
    network: TimeSeriesPoint[]
  }
  relatedIncidents: RelatedIncidentRef[]
  relatedDocs: RelatedDocRef[]
  aiInvestigation: AlertAIInvestigation
  /** Engineer who acknowledged the alert, if any — seeded for alerts already past "Open". */
  acknowledgedBy: string | null
  acknowledgedAt: string | null
}
