/**
 * Server access layer.
 *
 * Pages and components call these functions, never `data/servers.ts`
 * directly. That's the whole point of this file: today `getAllServers()`
 * returns an in-memory array; when the FastAPI backend exists, only the
 * body of these two functions changes (to `fetch('/api/servers')` etc.) —
 * every component that calls `getAllServers()` keeps working unmodified.
 */

import type { ServerItem } from '../types/server'
import { serversData } from '../data/servers'

export function getAllServers(): ServerItem[] {
  return serversData
}

export function getServerById(id: string): ServerItem | undefined {
  return serversData.find((server) => server.id === id)
}
