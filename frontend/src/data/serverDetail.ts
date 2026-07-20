/**
 * Mock data layer for the Server Details page.
 *
 * In production, `getServerDetail(server)` is where a FastAPI call would go —
 * e.g. `GET /api/servers/{id}/detail` — returning this same `ServerDetailBundle`
 * shape. Every UI component below reads only from that shape, so swapping the
 * mock generator for a real fetch will not require touching any component.
 *
 * The generator is deterministic (seeded from the server id) rather than
 * random, so a given server always renders the same "realistic" mock data
 * across reloads instead of flickering between renders.
 */

import type { ServerItem, ServerStatus } from './servers'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TimeSeriesPoint {
  time: string
  value: number
}

export type ServiceStatus = 'Running' | 'Degraded' | 'Stopped'

export interface RunningServiceItem {
  id: string
  name: string
  status: ServiceStatus
  cpu: number
  memory: number
  lastRestart: string
  port: number
}

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'
export type AlertStatus = 'open' | 'investigating' | 'acknowledged' | 'resolved'

export interface ServerAlertItem {
  id: string
  severity: AlertSeverity
  title: string
  timestamp: string
  status: AlertStatus
}

export type IncidentPriority = 'critical' | 'high' | 'medium' | 'low'
export type IncidentStatus = 'open' | 'investigating' | 'resolved'

export interface ServerIncidentItem {
  id: string
  title: string
  priority: IncidentPriority
  status: IncidentStatus
  engineer: string
  createdAt: string
}

export interface AIInvestigationData {
  summary: string
  observations: string[]
  rootCauses: string[]
  recommendedSteps: string[]
  relatedDocs: { title: string; type: string }[]
  similarIncidents: { id: string; title: string; resolvedIn: string }[]
  nextActions: string[]
  lastAnalyzed: string
}

export interface ServerConfiguration {
  cpuCores: number
  ramGb: number
  storageGb: number
  virtualizationPlatform: string
  backupStatus: 'Success' | 'Warning' | 'Failed'
  lastBackup: string
  osVersion: string
  agentVersion: string
}

export type TimelineEventType = 'alert' | 'metric' | 'backup' | 'update' | 'incident' | 'service'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description: string
  timestamp: string
}

export interface ServerHealthSummary {
  healthScore: number
  networkThroughputMbps: number
  runningServicesCount: number
  totalServicesCount: number
  activeAlertsCount: number
}

export interface ServerDetailBundle {
  uptime: string
  assignedTeam: string
  healthSummary: ServerHealthSummary
  performance: {
    cpu: TimeSeriesPoint[]
    memory: TimeSeriesPoint[]
    disk: TimeSeriesPoint[]
    network: TimeSeriesPoint[]
  }
  services: RunningServiceItem[]
  alerts: ServerAlertItem[]
  incidents: ServerIncidentItem[]
  aiInvestigation: AIInvestigationData
  configuration: ServerConfiguration
  timeline: TimelineEvent[]
}

// ---------------------------------------------------------------------------
// Deterministic helpers
// ---------------------------------------------------------------------------

function hashCode(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function pick<T>(items: readonly T[], seed: number): T {
  return items[seed % items.length]
}

const SERIES_TIMES = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

/** Builds a plausible 24h wave that lands on the server's current live value. */
function buildSeries(seed: number, current: number, amplitude: number, min: number, max: number): TimeSeriesPoint[] {
  const raw = SERIES_TIMES.map((_, i) => Math.sin((i + seed) * 0.55) * amplitude)
  const offset = current - raw[raw.length - 1]
  return SERIES_TIMES.map((time, i) => ({
    time,
    value: Math.round(clamp(raw[i] + offset, min, max)),
  }))
}

// ---------------------------------------------------------------------------
// Service stacks per workload type
// ---------------------------------------------------------------------------

const SERVICE_STACKS: Record<string, { name: string; port: number; baseCpu: number; baseMem: number }[]> = {
  Web: [
    { name: 'nginx', port: 443, baseCpu: 18, baseMem: 22 },
    { name: 'IIS', port: 80, baseCpu: 14, baseMem: 26 },
    { name: 'Docker', port: 2375, baseCpu: 9, baseMem: 15 },
  ],
  API: [
    { name: 'nginx', port: 443, baseCpu: 16, baseMem: 20 },
    { name: 'API Runtime', port: 8080, baseCpu: 24, baseMem: 32 },
    { name: 'Docker', port: 2375, baseCpu: 10, baseMem: 14 },
  ],
  Database: [
    { name: 'PostgreSQL', port: 5432, baseCpu: 34, baseMem: 41 },
    { name: 'SQL Server', port: 1433, baseCpu: 28, baseMem: 38 },
    { name: 'Backup Agent', port: 9553, baseCpu: 6, baseMem: 9 },
  ],
  Cache: [
    { name: 'Redis', port: 6379, baseCpu: 21, baseMem: 44 },
    { name: 'Docker', port: 2375, baseCpu: 8, baseMem: 12 },
  ],
  Auth: [
    { name: 'Authentication Service', port: 8443, baseCpu: 19, baseMem: 24 },
    { name: 'nginx', port: 443, baseCpu: 12, baseMem: 16 },
    { name: 'Docker', port: 2375, baseCpu: 7, baseMem: 11 },
  ],
  'File Storage': [
    { name: 'Samba', port: 445, baseCpu: 11, baseMem: 18 },
    { name: 'Docker', port: 2375, baseCpu: 7, baseMem: 10 },
  ],
  Kubernetes: [
    { name: 'Kubernetes Agent', port: 10250, baseCpu: 22, baseMem: 28 },
    { name: 'kube-proxy', port: 10256, baseCpu: 9, baseMem: 12 },
    { name: 'Docker', port: 2375, baseCpu: 12, baseMem: 16 },
  ],
  Monitoring: [
    { name: 'Prometheus', port: 9090, baseCpu: 26, baseMem: 36 },
    { name: 'Grafana Agent', port: 9091, baseCpu: 11, baseMem: 17 },
    { name: 'Docker', port: 2375, baseCpu: 8, baseMem: 12 },
  ],
  Worker: [
    { name: 'Worker Process', port: 9200, baseCpu: 29, baseMem: 27 },
    { name: 'Docker', port: 2375, baseCpu: 9, baseMem: 13 },
  ],
  'Object Storage': [
    { name: 'MinIO', port: 9000, baseCpu: 17, baseMem: 23 },
    { name: 'Docker', port: 2375, baseCpu: 8, baseMem: 11 },
  ],
}

const RESTART_WINDOWS = ['2 days ago', '5 days ago', '11 days ago', '18 days ago', '27 days ago', '41 days ago'] as const

// ---------------------------------------------------------------------------
// Alert / incident content pools
// ---------------------------------------------------------------------------

const ALERT_POOL: Record<ServerStatus, { severity: AlertSeverity; status: AlertStatus; template: string }[]> = {
  Critical: [
    { severity: 'critical', status: 'open', template: 'CPU usage on {host} exceeded 90% threshold' },
    { severity: 'critical', status: 'investigating', template: 'Memory pressure sustained above 85% on {host}' },
    { severity: 'high', status: 'open', template: 'Disk I/O latency spike detected on {host}' },
  ],
  Warning: [
    { severity: 'high', status: 'investigating', template: 'Memory usage trending above 80% on {host}' },
    { severity: 'medium', status: 'open', template: 'Disk usage above 65% threshold on {host}' },
    { severity: 'medium', status: 'acknowledged', template: 'Elevated response latency on {service} service' },
  ],
  Healthy: [
    { severity: 'low', status: 'resolved', template: 'SSL certificate renewal completed on {host}' },
    { severity: 'medium', status: 'acknowledged', template: 'Scheduled maintenance window acknowledged for {host}' },
  ],
}

const INCIDENT_POOL: Record<ServerStatus, { priority: IncidentPriority; status: IncidentStatus; template: string }[]> = {
  Critical: [
    { priority: 'critical', status: 'investigating', template: '{service} service degradation on {host}' },
    { priority: 'high', status: 'open', template: 'Resource exhaustion risk on {host}' },
  ],
  Warning: [
    { priority: 'medium', status: 'investigating', template: 'Intermittent latency reported on {host}' },
  ],
  Healthy: [
    { priority: 'low', status: 'resolved', template: 'Planned failover test on {host}' },
  ],
}

const ENGINEERS = ['A. Patel', 'M. Chen', 'R. Gomez', 'L. Brooks', 'S. Novak', 'J. Kim'] as const

// ---------------------------------------------------------------------------
// AI investigation content
// ---------------------------------------------------------------------------

const DOC_POOL = [
  { title: 'Runbook: High CPU Utilization Response', type: 'Runbook' },
  { title: 'Runbook: Memory Pressure Triage', type: 'Runbook' },
  { title: 'Playbook: Disk Capacity Escalation', type: 'Playbook' },
  { title: 'Guide: Service Restart Procedures', type: 'Guide' },
  { title: 'Architecture: Production Network Topology', type: 'Reference' },
] as const

function buildAIInvestigation(server: ServerItem, seed: number, driver: 'CPU' | 'memory' | 'disk'): AIInvestigationData {
  const host = server.hostname
  const service = server.service

  const summaryByStatus: Record<ServerStatus, string> = {
    Critical: `${host} is showing sustained ${driver} pressure consistent with the ${service} workload approaching capacity. Immediate triage is recommended to avoid service impact.`,
    Warning: `${host} is trending toward elevated ${driver} usage. No customer-facing impact detected yet, but the trend warrants proactive investigation.`,
    Healthy: `${host} is operating within normal parameters. No anomalies detected in the last analysis window.`,
  }

  const observationsByStatus: Record<ServerStatus, string[]> = {
    Critical: [
      `${driver} usage has remained above threshold for over 40 minutes.`,
      `${server.service} service response times increased alongside the ${driver.toLowerCase()} trend.`,
      `No corresponding traffic spike was observed, suggesting a resource-side cause rather than demand.`,
    ],
    Warning: [
      `${driver} usage is trending upward over the last 6 hours.`,
      `Other resource metrics on ${host} remain within normal range.`,
    ],
    Healthy: [
      `All monitored metrics are within expected operating range.`,
      `No alerts have fired for ${host} in the current window.`,
    ],
  }

  const rootCausesByStatus: Record<ServerStatus, string[]> = {
    Critical: [
      `Possible resource leak in the ${service.toLowerCase()} process.`,
      `Undersized instance for current ${service.toLowerCase()} load.`,
      `A recent deployment or configuration change may have altered resource behavior.`,
    ],
    Warning: [
      `Gradual load growth on the ${service.toLowerCase()} workload.`,
      `A background job or scheduled task may be consuming more resources than expected.`,
    ],
    Healthy: [`No root cause analysis required — server is healthy.`],
  }

  const stepsByStatus: Record<ServerStatus, string[]> = {
    Critical: [
      `Review the top processes on ${host} for abnormal ${driver.toLowerCase()} consumption.`,
      `Check recent deployments or config changes to the ${service} service.`,
      `Consider scaling ${service.toLowerCase()} horizontally if load-driven.`,
      `Open an incident if ${driver.toLowerCase()} remains above threshold for another 15 minutes.`,
    ],
    Warning: [
      `Monitor ${driver.toLowerCase()} trend over the next few hours.`,
      `Review scheduled jobs running on ${host} during the affected window.`,
    ],
    Healthy: [`Continue routine monitoring — no action required.`],
  }

  const status = server.status
  const similarSeed = seed % INCIDENT_POOL.Critical.length

  return {
    summary: summaryByStatus[status],
    observations: observationsByStatus[status],
    rootCauses: rootCausesByStatus[status],
    recommendedSteps: stepsByStatus[status],
    relatedDocs: [pick(DOC_POOL, seed), pick(DOC_POOL, seed + 1)],
    similarIncidents: [
      {
        id: `INC-${1000 + (seed % 900)}`,
        title: INCIDENT_POOL.Critical[similarSeed].template.replace('{service}', service).replace('{host}', 'a similar server'),
        resolvedIn: pick(['38m', '1h 12m', '2h 05m', '47m'], seed),
      },
    ],
    nextActions:
      status === 'Healthy'
        ? ['No action needed — continue standard monitoring cadence.']
        : ['Assign an engineer', 'Open an incident if not already tracked', 'Notify the on-call channel'],
    lastAnalyzed: 'Just now',
  }
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function getServerDetail(server: ServerItem): ServerDetailBundle {
  const seed = hashCode(server.id)
  const host = server.hostname

  // --- Performance series -------------------------------------------------
  const cpuSeries = buildSeries(seed, server.cpu, 14, 1, 99)
  const memorySeries = buildSeries(seed + 3, server.memory, 12, 1, 99)
  const diskSeries = buildSeries(seed + 6, server.disk, 4, 1, 99)
  const networkBase = 80 + (seed % 260)
  const networkSeries = buildSeries(seed + 9, networkBase, 60, 5, 900)

  // --- Services -------------------------------------------------------------
  const stack = SERVICE_STACKS[server.service] ?? SERVICE_STACKS.Web
  const services: RunningServiceItem[] = stack.map((svc, i) => {
    const degraded = server.status !== 'Healthy' && i === seed % stack.length
    const status: ServiceStatus = degraded ? (server.status === 'Critical' ? 'Stopped' : 'Degraded') : 'Running'
    return {
      id: `${server.id}-svc-${i}`,
      name: svc.name,
      status,
      cpu: clamp(svc.baseCpu + (seed % 9) - 4, 1, 95),
      memory: clamp(svc.baseMem + (seed % 11) - 5, 1, 95),
      lastRestart: pick(RESTART_WINDOWS, seed + i),
      port: svc.port,
    }
  })

  // --- Alerts -----------------------------------------------------------
  const alertTemplates = ALERT_POOL[server.status]
  const alertCount = server.status === 'Critical' ? 3 : server.status === 'Warning' ? 2 : 1
  const alerts: ServerAlertItem[] = alertTemplates.slice(0, alertCount).map((tpl, i) => ({
    id: `${server.id}-alert-${i}`,
    severity: tpl.severity,
    title: tpl.template.replace('{host}', host).replace('{service}', server.service),
    timestamp: pick(['12m ago', '28m ago', '1h 05m ago', '3h ago', '6h ago'], seed + i),
    status: tpl.status,
  }))

  // --- Incidents --------------------------------------------------------
  const incidentTemplates = INCIDENT_POOL[server.status]
  const incidents: ServerIncidentItem[] = incidentTemplates.map((tpl, i) => ({
    id: `INC-${2000 + (seed % 800) + i}`,
    title: tpl.template.replace('{host}', host).replace('{service}', server.service),
    priority: tpl.priority,
    status: tpl.status,
    engineer: pick(ENGINEERS, seed + i),
    createdAt: pick(['Today, 09:12', 'Today, 07:40', 'Yesterday, 22:05', '2 days ago'], seed + i),
  }))

  // --- Health summary -----------------------------------------------------
  const statusScoreBase = server.status === 'Healthy' ? 92 : server.status === 'Warning' ? 74 : 48
  const healthScore = clamp(statusScoreBase + (seed % 7) - 3, 1, 99)
  const runningServicesCount = services.filter((s) => s.status === 'Running').length

  // --- Configuration --------------------------------------------------
  const specsByService: Record<string, { cores: number; ram: number; storage: number }> = {
    Database: { cores: 16, ram: 64, storage: 1024 },
    Kubernetes: { cores: 8, ram: 32, storage: 512 },
    Cache: { cores: 8, ram: 32, storage: 256 },
    Monitoring: { cores: 8, ram: 32, storage: 512 },
    Worker: { cores: 8, ram: 16, storage: 256 },
    'Object Storage': { cores: 8, ram: 32, storage: 2048 },
    'File Storage': { cores: 4, ram: 16, storage: 2048 },
  }
  const specs = specsByService[server.service] ?? { cores: 4, ram: 16, storage: 256 }
  const backupStatus: ServerConfiguration['backupStatus'] =
    server.status === 'Critical' && seed % 4 === 0 ? 'Failed' : server.status === 'Warning' && seed % 3 === 0 ? 'Warning' : 'Success'

  const configuration: ServerConfiguration = {
    cpuCores: specs.cores,
    ramGb: specs.ram,
    storageGb: specs.storage,
    virtualizationPlatform: seed % 2 === 0 ? 'VMware vSphere 8.0' : 'Azure VM (Standard_D4s_v5)',
    backupStatus,
    lastBackup: backupStatus === 'Failed' ? 'Failed 3h ago' : pick(['1h ago', '3h ago', '6h ago', 'Last night, 02:00'], seed),
    osVersion: server.os,
    agentVersion: `OpsPilot Agent v${3 + (seed % 2)}.${seed % 9}.${(seed >> 2) % 9}`,
  }

  // --- Timeline -------------------------------------------------------
  const timeline: TimelineEvent[] = [
    {
      id: `${server.id}-tl-1`,
      type: 'backup',
      title: 'Backup completed',
      description: `Scheduled backup for ${host} completed successfully.`,
      timestamp: configuration.lastBackup,
    },
    {
      id: `${server.id}-tl-2`,
      type: 'metric',
      title: `${server.status === 'Healthy' ? 'Metrics nominal' : 'Resource spike detected'}`,
      description: `${server.status === 'Healthy' ? 'CPU, memory, and disk remained within normal range.' : `Elevated resource usage observed on ${host}.`}`,
      timestamp: '2h ago',
    },
    ...(alerts.length > 0
      ? [
          {
            id: `${server.id}-tl-3`,
            type: 'alert' as const,
            title: 'Alert created',
            description: alerts[0].title,
            timestamp: alerts[0].timestamp,
          },
        ]
      : []),
    ...(incidents.length > 0
      ? [
          {
            id: `${server.id}-tl-4`,
            type: 'incident' as const,
            title: 'Incident opened',
            description: incidents[0].title,
            timestamp: incidents[0].createdAt,
          },
        ]
      : []),
    {
      id: `${server.id}-tl-5`,
      type: 'update',
      title: 'System update installed',
      description: `Security patches applied to ${server.os} on ${host}.`,
      timestamp: pick(['1 day ago', '2 days ago', '4 days ago'], seed),
    },
    {
      id: `${server.id}-tl-6`,
      type: 'service',
      title: 'Service restarted',
      description: `${pick(stack, seed).name} restarted on ${host}.`,
      timestamp: pick(RESTART_WINDOWS, seed),
    },
  ]

  return {
    uptime: pick(['99.98%', '99.95%', '99.87%', '99.99%', '99.72%'], seed),
    assignedTeam: pick(['Platform Engineering', 'Infrastructure', 'SRE', 'Cloud Operations'], seed),
    healthSummary: {
      healthScore,
      networkThroughputMbps: networkBase,
      runningServicesCount,
      totalServicesCount: services.length,
      activeAlertsCount: alerts.filter((a) => a.status === 'open' || a.status === 'investigating').length,
    },
    performance: {
      cpu: cpuSeries,
      memory: memorySeries,
      disk: diskSeries,
      network: networkSeries,
    },
    services,
    alerts,
    incidents,
    aiInvestigation: buildAIInvestigation(server, seed, server.cpu >= server.memory && server.cpu >= server.disk ? 'CPU' : server.memory >= server.disk ? 'memory' : 'disk'),
    configuration,
    timeline,
  }
}
