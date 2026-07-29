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
