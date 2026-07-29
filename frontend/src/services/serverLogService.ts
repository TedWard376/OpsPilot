/**
 * Server logs access layer.
 * `getServerLogs(server)` is where a FastAPI call goes in production —
 * e.g. `GET /api/servers/{id}/logs` — returning this same `LogEntry[]` shape.
 */

import type { ServerItem } from '../types/server'
import type { LogEntry, LogLevel } from '../types/serverLogs'
import { hashCode, pick } from '../utils/mockDataGenerators'
import { SERVICE_STACKS } from '../data/serverDetail'
import { ERROR_TEMPLATES, INFO_TEMPLATES, WARN_TEMPLATES } from '../data/serverLogs'

function formatMinutesAgo(minutes: number): string {
  if (minutes <= 0) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder === 0 ? `${hours}h ago` : `${hours}h ${remainder}m ago`
}

export function getServerLogs(server: ServerItem, count = 40): LogEntry[] {
  const seed = hashCode(server.id)
  const stack = SERVICE_STACKS[server.service] ?? SERVICE_STACKS.Web
  const services = stack.map((s) => s.name)

  // Error-prone servers produce a heavier mix of WARN/ERROR lines.
  const errorWeight = server.status === 'Critical' ? 0.35 : server.status === 'Warning' ? 0.18 : 0.05
  const warnWeight = server.status === 'Critical' ? 0.25 : server.status === 'Warning' ? 0.25 : 0.12
  const stepMinutes = 1 + (seed % 3)

  return Array.from({ length: count }, (_, i) => {
    const roll = ((seed + i * 37) % 100) / 100
    const level: LogLevel = roll < errorWeight ? 'ERROR' : roll < errorWeight + warnWeight ? 'WARN' : 'INFO'
    const templates = level === 'ERROR' ? ERROR_TEMPLATES : level === 'WARN' ? WARN_TEMPLATES : INFO_TEMPLATES
    const service = pick(services, seed + i)

    return {
      id: `${server.id}-log-${i}`,
      timestamp: formatMinutesAgo(i * stepMinutes),
      level,
      service,
      message: pick(templates, seed + i * 5)(service),
    }
  })
}
