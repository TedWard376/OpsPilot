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
import { getAllServers, loadServerCache } from './serverService'
import { incidentAffectedSystems, incidentsData, systemLabelsForServers } from '../data/incidents'

interface BackendIncidentResponse {
  id: string
  title: string
  priority: 'P0' | 'P1' | 'P2' | 'P3' | IncidentItem['priority']
  status: IncidentItem['status']
  assignedEngineer: string
  createdAt: string
  updatedAt: string
  affectedServerIds?: string[]
  affectedServerId?: string
}

function normalizeIncidentPriority(priority: BackendIncidentResponse['priority']): IncidentItem['priority'] {
  switch (priority) {
    case 'P0':
      return 'Critical'
    case 'P1':
      return 'High'
    case 'P2':
      return 'Medium'
    case 'P3':
      return 'Low'
    default:
      return priority
  }
}

let incidentCache: IncidentItem[] = []
let incidentCachePromise: Promise<void> | null = null
let incidentIndexById = new Map<string, IncidentItem>()

function formatTimestamp(timestamp: string): string {
  const parsed = new Date(timestamp)
  if (Number.isNaN(parsed.valueOf())) {
    return timestamp
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthNames[parsed.getUTCMonth()]
  const day = parsed.getUTCDate()
  const year = parsed.getUTCFullYear()
  const hours = String(parsed.getUTCHours()).padStart(2, '0')
  const minutes = String(parsed.getUTCMinutes()).padStart(2, '0')

  return `${month} ${day}, ${year} ${hours}:${minutes}`
}

function formatDurationSince(timestamp: string): string {
  const parsed = new Date(timestamp)
  if (Number.isNaN(parsed.valueOf())) {
    return '0m'
  }

  const diffMs = Math.max(0, Date.now() - parsed.valueOf())
  const totalMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m`
}

function normalizeIncidentResponse(response: BackendIncidentResponse): IncidentItem {
  const affectedServerIds = response.affectedServerIds ?? (response.affectedServerId ? [response.affectedServerId] : [])
    const serverSystems = getAllServers().length > 0 ? systemLabelsForServers(affectedServerIds) : affectedServerIds

  const incident: IncidentItem = {
    id: response.id,
    title: response.title,
    priority: normalizeIncidentPriority(response.priority),
    status: response.status,
    assignedEngineer: response.assignedEngineer,
    createdAt: formatTimestamp(response.createdAt),
    createdAtISO: response.createdAt,
    updatedAt: formatTimestamp(response.updatedAt),
    duration: formatDurationSince(response.createdAt),
    affectedServerIds,
    affectedSystems: serverSystems,
  }

  return incident
}

export async function loadIncidentCache(forceRefresh = false): Promise<IncidentItem[]> {
  if (forceRefresh) {
    incidentCachePromise = null
  }

  if (!incidentCachePromise) {
    console.debug('[incidentService] loadIncidentCache: fetching /api/incidents')
    incidentCachePromise = fetch('/api/incidents')
      .then(async (response) => {
        console.debug('[incidentService] loadIncidentCache: response', response.status, response.headers.get('content-type'))
        if (!response.ok) {
          throw new Error('Unable to load incidents from the backend.')
        }

        const contentType = response.headers.get('content-type') ?? ''
        if (!contentType.includes('application/json')) {
          throw new Error(`Unexpected response type from /api/incidents: ${contentType}`)
        }

        await loadServerCache()

        const data = (await response.json()) as BackendIncidentResponse[]
        incidentCache = data.map(normalizeIncidentResponse)
        incidentIndexById = new Map(incidentCache.map((incident) => [incident.id, incident]))
      })
      .catch((error) => {
        console.error('[incidentService] loadIncidentCache error', error)
        incidentCache = []
        incidentIndexById = new Map()
        throw error
      })
  }

  await incidentCachePromise
  return incidentCache
}

export async function loadIncidentById(id: string): Promise<IncidentItem> {
  console.debug(`[incidentService] loadIncidentById: fetching /api/incidents/${id}`)
  const response = await fetch(`/api/incidents/${encodeURIComponent(id)}`)
  console.debug('[incidentService] loadIncidentById: response', response.status, response.headers.get('content-type'))

  if (!response.ok) {
    throw new Error('Unable to load the requested incident from the backend.')
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new Error(`Unexpected response type from /api/incidents/${id}: ${contentType}`)
  }

  await loadServerCache()
  const data = (await response.json()) as BackendIncidentResponse
  const incident = normalizeIncidentResponse(data)

  incidentCache = [incident, ...incidentCache.filter((item) => item.id !== incident.id)]
  incidentIndexById.set(incident.id, incident)

  return incident
}

export function getAllIncidents(): IncidentItem[] {
  return incidentCache
}

export function getIncidentById(id: string): IncidentItem | undefined {
  return incidentIndexById.get(id) ?? incidentCache.find((incident) => incident.id === id)
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
  incidentCache.unshift(incident)
  incidentIndexById.set(incident.id, incident)
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
  incidentIndexById.set(id, incident)
  return incident
}

void loadIncidentCache().catch(() => {
  // Intentionally swallowed so the UI can keep rendering and show its own error state.
})
