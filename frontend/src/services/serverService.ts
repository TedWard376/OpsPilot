/**
 * Server access layer.
 *
 * This service is the single frontend boundary for server inventory.
 * The public synchronous getters remain compatible with the rest of the
 * UI, while the cache is hydrated asynchronously from the FastAPI backend.
 */

import type { ServerItem } from '../types/server'

interface BackendServerResponse {
  id: string
  hostname: string
  environment: ServerItem['environment']
  operatingSystem: string
  status: ServerItem['status']
  location: string
  lastSeen: string
  lastSeenAt: string
  ipAddress: string
  service: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
}

let serverCache: ServerItem[] = []
let serverCachePromise: Promise<void> | null = null

function mapServerResponse(server: BackendServerResponse): ServerItem {
  return {
    id: server.id,
    hostname: server.hostname,
    environment: server.environment,
    os: server.operatingSystem,
    cpu: server.cpuUsage,
    memory: server.memoryUsage,
    disk: server.diskUsage,
    status: server.status,
    location: server.location,
    lastSeen: server.lastSeen,
    lastSeenAt: server.lastSeenAt,
    ipAddress: server.ipAddress,
    service: server.service,
  }
}

export async function loadServerCache(): Promise<ServerItem[]> {
  if (!serverCachePromise) {
    serverCachePromise = fetch('/api/servers')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load servers from the backend.')
        }

        const servers = (await response.json()) as BackendServerResponse[]
        serverCache = servers.map(mapServerResponse)
      })
      .catch((error) => {
        serverCache = []
        throw error
      })
  }

  await serverCachePromise
  return serverCache
}

export function getAllServers(): ServerItem[] {
  return serverCache
}

export function getServerById(id: string): ServerItem | undefined {
  return serverCache.find((server) => server.id === id)
}

void loadServerCache().catch(() => {
  // Intentionally swallowed so the UI can keep rendering and show its own error state.
})
