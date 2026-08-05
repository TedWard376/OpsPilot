import type { ServerItem } from '../types/server'
import type { ServerEnvironment } from '../types/server'

export type { ServerEnvironment } from '../types/server'

export type NewServerInput = {
  hostname: string
  environment: ServerEnvironment
  os: string
  service: string
  location: string
  ipAddress: string
}

export const SERVER_ENVIRONMENTS: ServerEnvironment[] = ['Production', 'Staging', 'Development']

export const SERVER_SERVICES = ['Web', 'API', 'Database', 'Cache', 'Build', 'Worker', 'Data Services', 'Logging'] as const

export const SERVER_OS_OPTIONS = [
  'Ubuntu 22.04 LTS',
  'Ubuntu 24.04 LTS',
  'Debian 12',
  'RHEL 9',
  'CentOS Stream 9',
  'Windows Server 2022',
  'Rocky Linux 9',
] as const

export const SERVER_LOCATIONS = [
  'us-east-1a',
  'us-east-1b',
  'us-east-1c',
  'us-east-1d',
  'us-east-1e',
  'us-west-2a',
  'us-west-2b',
  'eu-central-1a',
  'ap-southeast-1a',
] as const

export const serversData: ServerItem[] = [
  {
    id: 'srv-001',
    hostname: 'prod-web-01',
    environment: 'Production',
    os: 'Ubuntu 22.04 LTS',
    cpu: 38,
    memory: 61,
    disk: 54,
    status: 'Healthy',
    location: 'us-east-1a',
    lastSeen: 'Just now',
    lastSeenAt: '2026-08-03T09:42:00Z',
    ipAddress: '10.12.8.21',
    service: 'Web',
  },
  {
    id: 'srv-002',
    hostname: 'prod-api-02',
    environment: 'Production',
    os: 'Debian 12',
    cpu: 52,
    memory: 73,
    disk: 66,
    status: 'Healthy',
    location: 'us-east-1b',
    lastSeen: '1m ago',
    lastSeenAt: '2026-08-03T09:39:11Z',
    ipAddress: '10.12.8.22',
    service: 'API',
  },
  {
    id: 'srv-003',
    hostname: 'prod-db-01',
    environment: 'Production',
    os: 'RHEL 9',
    cpu: 74,
    memory: 81,
    disk: 71,
    status: 'Warning',
    location: 'us-east-1c',
    lastSeen: '2m ago',
    lastSeenAt: '2026-08-03T09:35:59Z',
    ipAddress: '10.12.8.31',
    service: 'Database',
  },
  {
    id: 'srv-004',
    hostname: 'staging-api-01',
    environment: 'Staging',
    os: 'Ubuntu 22.04 LTS',
    cpu: 29,
    memory: 57,
    disk: 49,
    status: 'Healthy',
    location: 'us-west-2a',
    lastSeen: '4m ago',
    lastSeenAt: '2026-08-03T09:28:15Z',
    ipAddress: '10.14.6.14',
    service: 'API',
  },
  {
    id: 'srv-005',
    hostname: 'dev-build-02',
    environment: 'Development',
    os: 'Ubuntu 24.04 LTS',
    cpu: 43,
    memory: 48,
    disk: 42,
    status: 'Healthy',
    location: 'eu-central-1a',
    lastSeen: '5m ago',
    lastSeenAt: '2026-08-03T09:20:42Z',
    ipAddress: '10.16.2.44',
    service: 'Build',
  },
  {
    id: 'srv-006',
    hostname: 'dr-cache-01',
    environment: 'Production',
    os: 'CentOS Stream 9',
    cpu: 33,
    memory: 69,
    disk: 61,
    status: 'Healthy',
    location: 'us-west-2b',
    lastSeen: '8m ago',
    lastSeenAt: '2026-08-03T09:16:08Z',
    ipAddress: '10.21.4.11',
    service: 'Cache',
  },
  {
    id: 'srv-007',
    hostname: 'prod-worker-03',
    environment: 'Production',
    os: 'Ubuntu 22.04 LTS',
    cpu: 92,
    memory: 88,
    disk: 78,
    status: 'Critical',
    location: 'us-east-1d',
    lastSeen: 'Just now',
    lastSeenAt: '2026-08-03T09:07:40Z',
    ipAddress: '10.12.8.51',
    service: 'Worker',
  },
  {
    id: 'srv-008',
    hostname: 'qa-data-01',
    environment: 'Development',
    os: 'Windows Server 2022',
    cpu: 24,
    memory: 55,
    disk: 44,
    status: 'Healthy',
    location: 'ap-southeast-1a',
    lastSeen: '10m ago',
    lastSeenAt: '2026-08-03T08:58:31Z',
    ipAddress: '10.18.9.27',
    service: 'Data Services',
  },
  {
    id: 'srv-009',
    hostname: 'prod-log-02',
    environment: 'Production',
    os: 'Rocky Linux 9',
    cpu: 66,
    memory: 70,
    disk: 57,
    status: 'Warning',
    location: 'us-east-1e',
    lastSeen: '12m ago',
    lastSeenAt: '2026-08-03T08:50:03Z',
    ipAddress: '10.12.8.62',
    service: 'Logging',
  },
]
