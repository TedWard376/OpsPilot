export type ServerEnvironment = 'Production' | 'Staging' | 'Development'

export type ServerStatus = 'Healthy' | 'Warning' | 'Critical'

export interface ServerItem {
  id: string
  hostname: string
  environment: ServerEnvironment
  os: string
  cpu: number
  memory: number
  disk: number
  status: ServerStatus
  location: string
  lastSeen: string
  /** ISO timestamp for sorting — API will provide this in production */
  lastSeenAt: string
  ipAddress: string
  service: string
}

export const serversData: ServerItem[] = [
  // Production — Web
  { id: 'srv-01', hostname: 'prod-web-01', environment: 'Production', os: 'Ubuntu 22.04 LTS', cpu: 78, memory: 65, disk: 42, status: 'Healthy', location: 'East US', lastSeen: 'Just now', lastSeenAt: '2026-07-13T09:45:00Z', ipAddress: '10.10.2.11', service: 'Web' },
  { id: 'srv-02', hostname: 'prod-web-02', environment: 'Production', os: 'Ubuntu 22.04 LTS', cpu: 45, memory: 72, disk: 58, status: 'Healthy', location: 'East US', lastSeen: '1m ago', lastSeenAt: '2026-07-13T09:44:00Z', ipAddress: '10.10.2.12', service: 'Web' },
  { id: 'srv-03', hostname: 'prod-web-03', environment: 'Production', os: 'Ubuntu 22.04 LTS', cpu: 52, memory: 61, disk: 39, status: 'Healthy', location: 'West US', lastSeen: '2m ago', lastSeenAt: '2026-07-13T09:43:00Z', ipAddress: '10.10.2.13', service: 'Web' },

  // Production — API
  { id: 'srv-04', hostname: 'prod-api-01', environment: 'Production', os: 'RHEL 9.1', cpu: 72, memory: 68, disk: 41, status: 'Warning', location: 'East US', lastSeen: 'Just now', lastSeenAt: '2026-07-13T09:45:00Z', ipAddress: '10.10.3.11', service: 'API' },
  { id: 'srv-05', hostname: 'prod-api-02', environment: 'Production', os: 'RHEL 9.1', cpu: 58, memory: 64, disk: 38, status: 'Healthy', location: 'East US', lastSeen: '1m ago', lastSeenAt: '2026-07-13T09:44:00Z', ipAddress: '10.10.3.12', service: 'API' },

  // Production — Database
  { id: 'srv-06', hostname: 'prod-db-01', environment: 'Production', os: 'RHEL 9.1', cpu: 94, memory: 89, disk: 76, status: 'Critical', location: 'East US', lastSeen: 'Just now', lastSeenAt: '2026-07-13T09:45:00Z', ipAddress: '10.10.1.11', service: 'Database' },
  { id: 'srv-07', hostname: 'prod-db-02', environment: 'Production', os: 'RHEL 9.1', cpu: 34, memory: 51, disk: 63, status: 'Healthy', location: 'West US', lastSeen: '2m ago', lastSeenAt: '2026-07-13T09:43:00Z', ipAddress: '10.10.1.12', service: 'Database' },

  // Production — File, Auth, Cache
  { id: 'srv-08', hostname: 'prod-file-01', environment: 'Production', os: 'Debian 12', cpu: 28, memory: 49, disk: 81, status: 'Healthy', location: 'East US', lastSeen: '4m ago', lastSeenAt: '2026-07-13T09:41:00Z', ipAddress: '10.10.7.11', service: 'File Storage' },
  { id: 'srv-09', hostname: 'prod-auth-01', environment: 'Production', os: 'Ubuntu 22.04 LTS', cpu: 35, memory: 42, disk: 28, status: 'Healthy', location: 'East US', lastSeen: 'Just now', lastSeenAt: '2026-07-13T09:45:00Z', ipAddress: '10.10.5.11', service: 'Auth' },
  { id: 'srv-10', hostname: 'prod-auth-02', environment: 'Production', os: 'Ubuntu 22.04 LTS', cpu: 32, memory: 39, disk: 27, status: 'Healthy', location: 'West US', lastSeen: '3m ago', lastSeenAt: '2026-07-13T09:42:00Z', ipAddress: '10.10.5.12', service: 'Auth' },
  { id: 'srv-11', hostname: 'prod-cache-01', environment: 'Production', os: 'Debian 12', cpu: 67, memory: 82, disk: 22, status: 'Warning', location: 'East US', lastSeen: 'Just now', lastSeenAt: '2026-07-13T09:45:00Z', ipAddress: '10.10.4.11', service: 'Cache' },

  // Production — Infrastructure
  { id: 'srv-12', hostname: 'prod-k8s-01', environment: 'Production', os: 'Ubuntu 22.04 LTS', cpu: 54, memory: 69, disk: 44, status: 'Healthy', location: 'East US', lastSeen: 'Just now', lastSeenAt: '2026-07-13T09:45:00Z', ipAddress: '10.10.8.11', service: 'Kubernetes' },
  { id: 'srv-13', hostname: 'prod-monitor-01', environment: 'Production', os: 'Ubuntu 22.04 LTS', cpu: 41, memory: 55, disk: 67, status: 'Warning', location: 'East US', lastSeen: '1m ago', lastSeenAt: '2026-07-13T09:44:00Z', ipAddress: '10.10.9.11', service: 'Monitoring' },
  { id: 'srv-14', hostname: 'prod-storage-01', environment: 'Production', os: 'Debian 12', cpu: 28, memory: 49, disk: 81, status: 'Healthy', location: 'East US', lastSeen: '4m ago', lastSeenAt: '2026-07-13T09:41:00Z', ipAddress: '10.10.11.11', service: 'Object Storage' },
  { id: 'srv-15', hostname: 'prod-worker-01', environment: 'Production', os: 'Ubuntu 22.04 LTS', cpu: 61, memory: 72, disk: 48, status: 'Warning', location: 'West US', lastSeen: '2m ago', lastSeenAt: '2026-07-13T09:43:00Z', ipAddress: '10.10.12.11', service: 'Worker' },

  // Staging
  { id: 'srv-16', hostname: 'staging-web-01', environment: 'Staging', os: 'Ubuntu 22.04 LTS', cpu: 22, memory: 35, disk: 28, status: 'Healthy', location: 'West EU', lastSeen: '3m ago', lastSeenAt: '2026-07-13T09:42:00Z', ipAddress: '10.20.2.11', service: 'Web' },
  { id: 'srv-17', hostname: 'staging-api-01', environment: 'Staging', os: 'RHEL 9.1', cpu: 28, memory: 38, disk: 32, status: 'Healthy', location: 'West EU', lastSeen: '5m ago', lastSeenAt: '2026-07-13T09:40:00Z', ipAddress: '10.20.3.11', service: 'API' },
  { id: 'srv-18', hostname: 'staging-db-01', environment: 'Staging', os: 'Ubuntu 22.04 LTS', cpu: 18, memory: 32, disk: 45, status: 'Healthy', location: 'West EU', lastSeen: '6m ago', lastSeenAt: '2026-07-13T09:39:00Z', ipAddress: '10.20.1.11', service: 'Database' },
  { id: 'srv-19', hostname: 'staging-file-01', environment: 'Staging', os: 'Debian 12', cpu: 14, memory: 26, disk: 52, status: 'Healthy', location: 'West EU', lastSeen: '8m ago', lastSeenAt: '2026-07-13T09:37:00Z', ipAddress: '10.20.7.11', service: 'File Storage' },
  { id: 'srv-20', hostname: 'staging-auth-01', environment: 'Staging', os: 'Ubuntu 22.04 LTS', cpu: 15, memory: 25, disk: 22, status: 'Healthy', location: 'West EU', lastSeen: '7m ago', lastSeenAt: '2026-07-13T09:38:00Z', ipAddress: '10.20.5.11', service: 'Auth' },
  { id: 'srv-21', hostname: 'staging-app-01', environment: 'Staging', os: 'Ubuntu 22.04 LTS', cpu: 23, memory: 38, disk: 29, status: 'Healthy', location: 'West EU', lastSeen: '3m ago', lastSeenAt: '2026-07-13T09:42:00Z', ipAddress: '10.20.2.12', service: 'Web' },

  // Development
  { id: 'srv-22', hostname: 'dev-web-01', environment: 'Development', os: 'Ubuntu 22.04 LTS', cpu: 12, memory: 24, disk: 18, status: 'Healthy', location: 'West EU', lastSeen: '5m ago', lastSeenAt: '2026-07-13T09:40:00Z', ipAddress: '10.30.2.11', service: 'Web' },
  { id: 'srv-23', hostname: 'dev-api-01', environment: 'Development', os: 'RHEL 9.1', cpu: 15, memory: 25, disk: 20, status: 'Healthy', location: 'West EU', lastSeen: '10m ago', lastSeenAt: '2026-07-13T09:35:00Z', ipAddress: '10.30.3.11', service: 'API' },
  { id: 'srv-24', hostname: 'dev-db-01', environment: 'Development', os: 'Ubuntu 22.04 LTS', cpu: 10, memory: 20, disk: 35, status: 'Healthy', location: 'West EU', lastSeen: '12m ago', lastSeenAt: '2026-07-13T09:33:00Z', ipAddress: '10.30.1.11', service: 'Database' },
  { id: 'srv-25', hostname: 'dev-app-01', environment: 'Development', os: 'Ubuntu 22.04 LTS', cpu: 12, memory: 24, disk: 18, status: 'Healthy', location: 'West EU', lastSeen: '5m ago', lastSeenAt: '2026-07-13T09:40:00Z', ipAddress: '10.30.2.12', service: 'Web' },
]

export function getServerById(id: string): ServerItem | undefined {
  return serversData.find((server) => server.id === id)
}

export default serversData
