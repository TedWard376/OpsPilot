/**
 * Alert access layer.
 * Pages and components call these functions, never `data/alerts.ts`
 * directly. `getAllAlerts`/`getAlertById` become `GET /api/alerts` and
 * `GET /api/alerts/{id}` once the backend exists.
 */

import type { AlertItem } from '../types/alert'
import { alertSources, alertsData } from '../data/alerts'

export function getAllAlerts(): AlertItem[] {
  return alertsData
}

export function getAlertById(id: string): AlertItem | undefined {
  return alertsData.find((alert) => alert.id === id)
}

export function getAlertSources(): readonly string[] {
  return alertSources
}

/**
 * Patches an existing alert in place (acknowledgement, status changes).
 * In production this becomes `PATCH /api/alerts/{id}`. Mirrors
 * `updateIncident` in incidentService.ts.
 */
export function updateAlert(id: string, patch: Partial<AlertItem>): AlertItem | undefined {
  const alert = getAlertById(id)
  if (!alert) return undefined
  Object.assign(alert, patch)
  return alert
}
