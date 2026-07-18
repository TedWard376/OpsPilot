export interface ServerItem {
  id: string
  hostname: string
  environment: 'Production' | 'Staging' | 'Development'
  os: string
  cpu: number
  memory: number
  disk: number
  status: 'Healthy' | 'Warning' | 'Critical'
  location: string
  lastSeen: string
}

export const serversData: ServerItem[] = [
  { id: 'srv-01', hostname: 'prod-web-01', environment: 'Production', os: 'Ubuntu 22.04 LTS', cpu: 78, memory: 65, disk: 42, status: 'Healthy', location: 'East US', lastSeen: 'Just now' },
  { id: 'srv-02', hostname: 'prod-web-02', environment: 'Production', os: 'Ubuntu 22.04 LTS', cpu: 45, memory: 72, disk: 58, status: 'Healthy', location: 'East US', lastSeen: '1m ago' },
  { id: 'srv-03', hostname: 'prod-db-01', environment: 'Production', os: 'RHEL 9.1', cpu: 94, memory: 89, disk: 76, status: 'Critical', location: 'East US', lastSeen: 'Just now' },
  { id: 'srv-04', hostname: 'prod-db-02', environment: 'Production', os: 'RHEL 9.1', cpu: 34, memory: 51, disk: 63, status: 'Healthy', location: 'West US', lastSeen: '2m ago' },
  { id: 'srv-05', hostname: 'staging-app-01', environment: 'Staging', os: 'Ubuntu 22.04 LTS', cpu: 23, memory: 38, disk: 29, status: 'Healthy', location: 'West EU', lastSeen: '3m ago' },
  { id: 'srv-06', hostname: 'prod-cache-01', environment: 'Production', os: 'Debian 12', cpu: 67, memory: 82, disk: 22, status: 'Warning', location: 'East US', lastSeen: 'Just now' },
  { id: 'srv-07', hostname: 'prod-k8s-01', environment: 'Production', os: 'Ubuntu 22.04 LTS', cpu: 54, memory: 69, disk: 44, status: 'Healthy', location: 'East US', lastSeen: 'Just now' },
  { id: 'srv-08', hostname: 'dev-app-01', environment: 'Development', os: 'Ubuntu 22.04 LTS', cpu: 12, memory: 24, disk: 18, status: 'Healthy', location: 'West EU', lastSeen: '5m ago' },
  { id: 'srv-09', hostname: 'prod-monitor-01', environment: 'Production', os: 'Ubuntu 22.04 LTS', cpu: 41, memory: 55, disk: 67, status: 'Warning', location: 'East US', lastSeen: '1m ago' },
  { id: 'srv-10', hostname: 'prod-storage-01', environment: 'Production', os: 'Debian 12', cpu: 28, memory: 49, disk: 81, status: 'Healthy', location: 'East US', lastSeen: '4m ago' },
]

export default serversData
