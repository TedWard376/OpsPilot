/**
 * Alert access layer.
 *
 * Pages and components call these functions, never `fetch` directly and
 * never a mock data file (the old `data/alerts.ts` mock has been removed
 * now that this service talks to the real backend). `getAllAlerts()` /
 * `getAlertById()` are backed by `GET /api/alerts` and
 * `GET /api/alerts/{id}`.
 *
 * This mirrors the pattern already used by serverService.ts and
 * incidentService.ts: a module-level cache is hydrated asynchronously by
 * `loadAlertCache()` / `loadAlertById()`, while the rest of the app keeps
 * reading through synchronous `getAllAlerts()` / `getAlertById()` getters.
 * That keeps existing call sites (e.g. documentationService.ts, which
 * calls `getAllAlerts()` synchronously) working unchanged.
 */

import type { AlertItem } from '../types/alert'
import { getServerById, loadServerCache } from './serverService'
import { API_BASE_URL } from '../config/api'

/**
 * Shape returned by the FastAPI backend (see
 * backend/app/schemas/alert.py). Most fields line up 1:1 with `AlertItem`,
 * but there are a few intentional differences, handled in
 * `normalizeAlertResponse` below:
 *
 * - The backend calls the headline text `title`; the frontend calls it
 *   `name` (matching the rest of this app's alert vocabulary, and the
 *   existing `AlertItem` type). We rename it at this boundary rather than
 *   renaming it throughout the app.
 * - The backend only sends `affectedServerId`. The frontend also wants
 *   `affectedServerHostname` for display, so it's resolved locally via
 *   `serverService.getServerById()`.
 * - The backend sends a single `timestamp`. The frontend derives two
 *   different presentations from it: a formatted `triggerTime` string and
 *   a live `duration` ("how long has this been open") — neither of which
 *   the backend needs to compute or store.
 * - `createdAt` (record-creation time) is part of the backend contract but
 *   isn't modeled on `AlertItem` because no part of the current UI reads
 *   it; `timestamp`/`triggerTime` already covers what's shown.
 */
interface BackendAlertResponse {
  id: string
  title: string
  description: string
  severity: string
  status: string
  source: string
  affectedServerId: string
  category: string
  environment: string
  timestamp: string
  acknowledged: boolean
  acknowledgedBy: string | null
  createdAt: string
}

// Static list of alert sources for the "Filter by source" dropdown. This is
// UI filter configuration, not alert data, so it isn't backed by an API
// endpoint — it previously lived in data/alerts.ts alongside the mock
// alerts, and moves here now that that file is gone.
export const alertSources = [
  'OpsPilot Monitoring',
  'Prometheus',
  'Health Check',
  'Log Analyzer',
  'Network Monitor',
  'Backup Service',
  'Security Scanner',
] as const

let alertCache: AlertItem[] = []
let alertCachePromise: Promise<void> | null = null
let alertIndexById = new Map<string, AlertItem>()

function formatTriggerTime(timestamp: string): string {
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

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

function normalizeAlertResponse(response: BackendAlertResponse): AlertItem {
  const server = getServerById(response.affectedServerId)

  return {
    id: response.id,
    name: response.title,
    description: response.description,
    severity: response.severity as AlertItem['severity'],
    status: response.status as AlertItem['status'],
    source: response.source,
    affectedServerId: response.affectedServerId,
    affectedServerHostname: server?.hostname ?? response.affectedServerId,
    category: response.category,
    environment: response.environment as AlertItem['environment'],
    triggerTime: formatTriggerTime(response.timestamp),
    triggerTimeISO: response.timestamp,
    duration: formatDurationSince(response.timestamp),
    acknowledged: response.acknowledged,
    acknowledgedBy: response.acknowledgedBy,
  }
}

/**
 * Loads (or refreshes) the full alert list from `GET /api/alerts` into the
 * module-level cache. Concurrent callers share the same in-flight request.
 */
export async function loadAlertCache(forceRefresh = false): Promise<AlertItem[]> {
  if (forceRefresh) {
    alertCachePromise = null
  }

  if (!alertCachePromise) {
    alertCachePromise = fetch(`${API_BASE_URL}/api/alerts`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load alerts from the backend.')
        }

        // Alerts only carry a server id; make sure the server cache is
        // populated first so hostnames can be resolved below.
        await loadServerCache()

        const alerts = (await response.json()) as BackendAlertResponse[]
        alertCache = alerts.map(normalizeAlertResponse)
        alertIndexById = new Map(alertCache.map((alert) => [alert.id, alert]))
      })
      .catch((error) => {
        alertCache = []
        alertIndexById = new Map()
        throw error
      })
  }

  await alertCachePromise
  return alertCache
}

/**
 * Loads a single alert from `GET /api/alerts/{id}`.
 *
 * Resolves to `undefined` for a 404 response, so pages can render an
 * "alert not found" state, and throws for any other failure, so pages can
 * render a generic error state.
 */
export async function loadAlertById(id: string): Promise<AlertItem | undefined> {
  const response = await fetch(`${API_BASE_URL}/api/alerts/${encodeURIComponent(id)}`)

  if (response.status === 404) {
    return undefined
  }

  if (!response.ok) {
    throw new Error('Unable to load the requested alert from the backend.')
  }

  await loadServerCache()

  const data = (await response.json()) as BackendAlertResponse
  const alert = normalizeAlertResponse(data)

  alertCache = [alert, ...alertCache.filter((item) => item.id !== alert.id)]
  alertIndexById.set(alert.id, alert)

  return alert
}

export function getAllAlerts(): AlertItem[] {
  return alertCache
}

export function getAlertById(id: string): AlertItem | undefined {
  return alertIndexById.get(id) ?? alertCache.find((alert) => alert.id === id)
}

export function getAlertSources(): readonly string[] {
  return alertSources
}

/**
 * Patches an existing alert in place (acknowledgement, status changes).
 * The backend currently only exposes GET endpoints for alerts, so this
 * remains a client-side-only mutation — same behaviour as before — and
 * will become `PATCH /api/alerts/{id}` once that endpoint exists. Mirrors
 * `updateIncident` in incidentService.ts.
 */
export function updateAlert(id: string, patch: Partial<AlertItem>): AlertItem | undefined {
  const alert = getAlertById(id)
  if (!alert) return undefined
  Object.assign(alert, patch)
  alertIndexById.set(id, alert)
  return alert
}

void loadAlertCache().catch(() => {
  // Intentionally swallowed so the UI can keep rendering and show its own error state.
})
