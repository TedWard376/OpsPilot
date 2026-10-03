/**
 * Documentation access layer.
 *
 * Pages and components call these functions, never `fetch` directly and
 * never a mock data file (the old `data/documentation.ts` mock has been
 * removed now that this service talks to the real backend). `getAllDocs()`
 * / `getDocById()` are backed by `GET /api/documentation` and
 * `GET /api/documentation/{id}`.
 *
 * This mirrors the pattern already used by serverService.ts / alertService.ts
 * / incidentService.ts: a module-level cache is hydrated asynchronously by
 * `loadDocCache()` / `loadDocById()`, while the rest of the app keeps
 * reading through synchronous `getAllDocs()` / `getDocById()` getters.
 */

import type { DocCategory, DocDetailBundle, DocItem, DocType, RelatedAlertRef, RelatedDocRef, RelatedIncidentRef, RelatedServerRef } from '../types/documentation'
import { getAllServers } from './serverService'
import { getAllAlerts } from './alertService'
import { getAllIncidents } from './incidentService'
import { hashCode, pick } from '../utils/mockDataGenerators'
import { API_BASE_URL } from '../config/api'

/**
 * Shape returned by the FastAPI backend (see
 * backend/app/schemas/documentation.py). A few intentional differences
 * from `DocItem`, handled in `normalizeDocResponse` below:
 *
 * - The backend calls the type field `documentType`; the frontend calls it
 *   `type` (matching the existing `DocItem` type and `DocTypeBadge`
 *   component). Renamed at this boundary rather than throughout the app.
 * - The backend's `documentType`/`category` values use a different
 *   vocabulary than the old mock did (e.g. "Troubleshooting Guide" instead
 *   of "Guide", "VMware"/"Azure" instead of "Compute"/"Database"). The
 *   `DocType`/`DocCategory` unions in types/documentation.ts have been
 *   widened to match the real backend values.
 * - The backend sends one flat `content` string per document rather than
 *   the mock's multiple headed `DocSection`s. `getDocDetail()` wraps that
 *   string as a single section so the existing `DocContentSection`
 *   component renders it unchanged.
 * - The backend also sends `version`, `status`, and `createdAt`, none of
 *   which the current UI displays, so they aren't modeled on `DocItem` —
 *   same precedent as `alertService.ts` dropping unused backend fields.
 */
interface BackendDocumentResponse {
  id: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  documentType: string
  author: string
  version: string
  status: string
  createdAt: string
  updatedAt: string
  lastReviewedAt: string
}

let docCache: DocItem[] = []
let docCachePromise: Promise<void> | null = null
let docIndexById = new Map<string, DocItem>()
// Raw backend responses, kept alongside docCache so getDocDetail() can read
// the full `content` string without adding it to the DocItem shape the
// list page and cards rely on.
let docRawById = new Map<string, BackendDocumentResponse>()

function formatRelativeTime(iso: string): string {
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.valueOf())) {
    return iso
  }

  const diffDays = Math.floor(Math.max(0, Date.now() - parsed.valueOf()) / (24 * 60 * 60 * 1000))

  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`

  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks < 5) return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return diffMonths <= 1 ? '1 month ago' : `${diffMonths} months ago`

  const diffYears = Math.floor(diffDays / 365)
  return diffYears <= 1 ? '1 year ago' : `${diffYears} years ago`
}

function normalizeDocResponse(response: BackendDocumentResponse): DocItem {
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    type: response.documentType as DocType,
    category: response.category as DocCategory,
    tags: response.tags,
    author: response.author,
    lastUpdated: formatRelativeTime(response.updatedAt),
    lastUpdatedISO: response.updatedAt,
  }
}

/**
 * Loads (or refreshes) the full documentation list from
 * `GET /api/documentation` into the module-level cache. Concurrent callers
 * share the same in-flight request.
 */
export async function loadDocCache(forceRefresh = false): Promise<DocItem[]> {
  if (forceRefresh) {
    docCachePromise = null
  }

  if (!docCachePromise) {
    docCachePromise = fetch(`${API_BASE_URL}/api/documentation`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load documentation from the backend.')
        }

        const documents = (await response.json()) as BackendDocumentResponse[]
        docCache = documents.map(normalizeDocResponse)
        docIndexById = new Map(docCache.map((doc) => [doc.id, doc]))
        docRawById = new Map(documents.map((doc) => [doc.id, doc]))
      })
      .catch((error) => {
        docCache = []
        docIndexById = new Map()
        docRawById = new Map()
        throw error
      })
  }

  await docCachePromise
  return docCache
}

/**
 * Loads a single document from `GET /api/documentation/{id}`.
 *
 * Resolves to `undefined` for a 404 response, so pages can render a
 * "document not found" state, and throws for any other failure, so pages
 * can render a generic error state.
 */
export async function loadDocById(id: string): Promise<DocItem | undefined> {
  const response = await fetch(`${API_BASE_URL}/api/documentation/${encodeURIComponent(id)}`)

  if (response.status === 404) {
    return undefined
  }

  if (!response.ok) {
    throw new Error('Unable to load the requested document from the backend.')
  }

  const data = (await response.json()) as BackendDocumentResponse
  const doc = normalizeDocResponse(data)

  docCache = [doc, ...docCache.filter((item) => item.id !== doc.id)]
  docIndexById.set(doc.id, doc)
  docRawById.set(doc.id, data)

  return doc
}

export function getAllDocs(): DocItem[] {
  return docCache
}

export function getDocById(id: string): DocItem | undefined {
  return docIndexById.get(id) ?? docCache.find((doc) => doc.id === id)
}

export function getDocCategories(): DocCategory[] {
  return Array.from(new Set(docCache.map((doc) => doc.category))).sort() as DocCategory[]
}

export function getDocTags(): string[] {
  return Array.from(new Set(docCache.flatMap((doc) => doc.tags))).sort()
}

/**
 * Builds a doc's detail-page bundle: its content section plus
 * deterministically-sampled cross-links into real servers, alerts, and
 * incidents. Seeded from the doc id so the same doc always links to the
 * same items across reloads.
 *
 * The backend doesn't yet expose a `/documentation/{id}/detail` endpoint,
 * so the related-items sampling below stays client-side for now — same
 * approach as `getAlertDetail()` before an equivalent alert-detail
 * endpoint exists.
 */
export function getDocDetail(doc: DocItem): DocDetailBundle {
  const seed = hashCode(doc.id)
  const allServers = getAllServers()
  const allAlerts = getAllAlerts()
  const allIncidents = getAllIncidents()
  const otherDocs = docCache.filter((candidate) => candidate.id !== doc.id)
  const rawContent = docRawById.get(doc.id)?.content ?? doc.description

  const relatedServers: RelatedServerRef[] = allServers.length
    ? [pick(allServers, seed), pick(allServers, seed + 1)]
        .filter((server, index, list) => list.findIndex((s) => s.id === server.id) === index)
        .map((server) => ({ id: server.id, hostname: server.hostname, status: server.status }))
    : []

  const relatedAlerts: RelatedAlertRef[] = allAlerts.length
    ? [pick(allAlerts, seed + 2)].map((alert) => ({ id: alert.id, name: alert.name, severity: alert.severity }))
    : []

  const relatedIncidents: RelatedIncidentRef[] = allIncidents.length
    ? [pick(allIncidents, seed + 3)].map((incident) => ({
        id: incident.id,
        title: incident.title,
        priority: incident.priority,
        status: incident.status,
      }))
    : []

  const relatedDocs: RelatedDocRef[] = otherDocs.length
    ? [pick(otherDocs, seed + 4), pick(otherDocs, seed + 5)]
        .filter((related, index, list) => list.findIndex((d) => d.id === related.id) === index)
        .map((related) => ({ title: related.title, type: related.type, description: related.description }))
    : []

  return {
    // The backend sends one flat `content` string; wrapped here as a
    // single section so DocContentSection (which expects heading + body[])
    // renders it unchanged.
    sections: [
      {
        id: 'content',
        heading: 'Documentation',
        body: rawContent
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
      },
    ],
    relatedServers,
    relatedAlerts,
    relatedIncidents,
    relatedDocs,
    aiAssistant: {
      summary: `Ask the AI Assistant to walk through "${doc.title}" for a specific server, or to summarize what changed since it was last updated.`,
      suggestedPrompts: [
        `Summarize this ${doc.type.toLowerCase()} in three steps`,
        `Which of my servers are most likely to need this?`,
        `Has anything in this doc gone out of date?`,
      ],
    },
  }
}

void loadDocCache().catch(() => {
  // Intentionally swallowed so the UI can keep rendering and show its own error state.
})
