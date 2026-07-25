/**
 * Mock data for the server logs viewer.
 * `getServerLogs(server)` is where a FastAPI call goes in production —
 * e.g. `GET /api/servers/{id}/logs` — returning this same `LogEntry[]` shape.
 */

import type { ServerItem } from './servers'
import { SERVICE_STACKS } from './serverDetail'

export type LogLevel = 'INFO' | 'WARN' | 'ERROR'

export interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  service: string
  message: string
}

function hashCode(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function pick<T>(items: readonly T[], seed: number): T {
  return items[seed % items.length]
}

const INFO_TEMPLATES = [
  (svc: string) => `${svc} health check passed`,
  (svc: string) => `${svc} accepted new connection`,
  (svc: string) => `${svc} completed scheduled task`,
  (svc: string) => `${svc} configuration reloaded`,
  (svc: string) => `${svc} request completed in 42ms`,
  (svc: string) => `${svc} cache warmed successfully`,
]

const WARN_TEMPLATES = [
  (svc: string) => `${svc} response time above 500ms`,
  (svc: string) => `${svc} connection pool nearing capacity`,
  (svc: string) => `${svc} retrying failed upstream call`,
  (svc: string) => `${svc} disk usage approaching threshold`,
  (svc: string) => `${svc} deprecated API endpoint called`,
]

const ERROR_TEMPLATES = [
  (svc: string) => `${svc} failed to connect to upstream dependency`,
  (svc: string) => `${svc} request timed out after 30s`,
  (svc: string) => `${svc} unhandled exception in request handler`,
  (svc: string) => `${svc} out of memory — process restarted`,
  (svc: string) => `${svc} authentication failure from unknown client`,
]

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
