import type { AlertSeverity } from './alert'
import type { IncidentPriority, IncidentStatus } from './incident'

export type DocType = 'Runbook' | 'Playbook' | 'Guide' | 'Reference'

export type DocCategory = 'Compute' | 'Database' | 'Networking' | 'Security' | 'Storage' | 'Monitoring'

/** A single catalog entry — what renders on the Documentation list page. */
export interface DocItem {
  id: string
  title: string
  type: DocType
  category: DocCategory
  description: string
  tags: string[]
  author: string
  lastUpdated: string
  lastUpdatedISO: string
}

/** One block of content on a doc's detail page (an "Overview", "Diagnosis Steps", etc.). */
export interface DocSection {
  id: string
  heading: string
  body: string[]
}

export interface RelatedServerRef {
  id: string
  hostname: string
  status: string
}

export interface RelatedAlertRef {
  id: string
  name: string
  severity: AlertSeverity
}

export interface RelatedIncidentRef {
  id: string
  title: string
  priority: IncidentPriority
  status: IncidentStatus
}

export interface RelatedDocRef {
  title: string
  type: DocType
  description: string
}

/** Placeholder AI Assistant content for a doc's detail page — no live AI call yet. */
export interface AIAssistantPlaceholder {
  summary: string
  suggestedPrompts: string[]
}

export interface DocDetailBundle {
  sections: DocSection[]
  relatedServers: RelatedServerRef[]
  relatedAlerts: RelatedAlertRef[]
  relatedIncidents: RelatedIncidentRef[]
  relatedDocs: RelatedDocRef[]
  aiAssistant: AIAssistantPlaceholder
}
