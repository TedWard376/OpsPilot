export type IncidentPriority = 'Critical' | 'High' | 'Medium' | 'Low'

export type IncidentStatus = 'Open' | 'Investigating' | 'Monitoring' | 'Resolved' | 'Closed'

export interface IncidentItem {
  id: string
  title: string
  priority: IncidentPriority
  status: IncidentStatus
  assignedEngineer: string
  createdAt: string
  /** ISO timestamp for sorting — API will provide this in production */
  createdAtISO: string
  updatedAt: string
  duration: string
  /** IDs of the specific servers affected — the source of truth for impact. */
  affectedServerIds: string[]
  /** System-category labels, derived from the affected servers' service types. */
  affectedSystems: string[]
}

/** Payload for creating a new incident (Create Incident form). */
export interface NewIncidentInput {
  title: string
  priority: IncidentPriority
  assignedEngineer: string
  /** Specific servers selected in the Create Incident form. */
  affectedServerIds: string[]
}
