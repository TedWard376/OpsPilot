/**
 * Incident access layer.
 *
 * Pages and components call these functions, never `data/incidents.ts`
 * directly. `getAllIncidents`/`getIncidentById` become `GET /api/incidents`
 * and `GET /api/incidents/{id}`; `addIncident`/`updateIncident` become
 * `POST /api/incidents` and `PATCH /api/incidents/{id}`. Until then, they
 * read and mutate the in-memory `incidentsData` array — mutations persist
 * for the rest of the session since it's a module-level singleton.
 */

import type { IncidentItem, NewIncidentInput } from '../types/incident'
import { incidentAffectedSystems, incidentEngineers, incidentsData, systemLabelsForServers } from '../data/incidents'

export function getAllIncidents(): IncidentItem[] {
  return incidentsData
}

export function getIncidentById(id: string): IncidentItem | undefined {
  return incidentsData.find((incident) => incident.id === id)
}

export function getIncidentEngineers(): readonly string[] {
  return incidentEngineers
}

export function getIncidentAffectedSystems(): readonly string[] {
  return incidentAffectedSystems
}

/** Generates the next sequential incident ID, e.g. INC-2042. */
function generateIncidentId(): string {
  const highest = incidentsData.reduce((max, incident) => {
    const num = Number(incident.id.replace('INC-', ''))
    return Number.isFinite(num) && num > max ? num : max
  }, 0)
  return `INC-${highest + 1}`
}

/**
 * Creates a new incident and adds it to the in-memory dataset.
 * In production this becomes `POST /api/incidents`.
 */
export function addIncident(input: NewIncidentInput): IncidentItem {
  const now = new Date()
  const nowLabel = 'Just now'

  const incident: IncidentItem = {
    id: generateIncidentId(),
    title: input.title,
    priority: input.priority,
    status: 'Open',
    assignedEngineer: input.assignedEngineer,
    createdAt: nowLabel,
    createdAtISO: now.toISOString(),
    updatedAt: nowLabel,
    duration: '0m',
    affectedServerIds: input.affectedServerIds,
    affectedSystems: systemLabelsForServers(input.affectedServerIds),
  }

  incidentsData.unshift(incident)
  return incident
}

/**
 * Patches an existing incident in place (reassignment, escalation, status
 * changes). In production this becomes `PATCH /api/incidents/{id}`.
 */
export function updateIncident(id: string, patch: Partial<IncidentItem>): IncidentItem | undefined {
  const incident = getIncidentById(id)
  if (!incident) return undefined
  Object.assign(incident, patch)
  return incident
}
