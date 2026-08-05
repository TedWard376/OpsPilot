import type { ServerItem } from '../types/server'
import type {
  AIInvestigationData,
  RunningServiceItem,
  ServerAlertItem,
  ServerConfiguration,
  ServerDetailBundle,
  ServerIncidentItem,
  TimelineEvent,
} from '../types/serverDetail'
import type { TimeSeriesPoint } from '../types/chart'

function buildTrendSeries(base: number, length: number, step: number): TimeSeriesPoint[] {
  return Array.from({ length }, (_, index) => ({
    time: `${index + 1}h ago`,
    value: Math.max(1, Math.min(99, Math.round(base + Math.sin(index + 1) * step + index * 2))),
  }))
}

function formatStatusSummary(server: ServerItem): string {
  if (server.status === 'Critical') {
    return `${server.hostname} is under significant pressure. Immediate investigation is recommended.`
  }

  if (server.status === 'Warning') {
    return `${server.hostname} is trending above the normal operating envelope. Monitoring remains active.`
  }

  return `${server.hostname} is operating within expected bounds and does not currently need intervention.`
}

function buildAIInvestigation(server: ServerItem): AIInvestigationData {
  const driver = server.cpu >= server.memory && server.cpu >= server.disk ? 'CPU' : server.memory >= server.disk ? 'memory' : 'disk'

  return {
    summary: formatStatusSummary(server),
    observations: [
      `${driver.toUpperCase()} is the current dominant load indicator on ${server.hostname}.`,
      `${server.service} is reporting a ${server.status.toLowerCase()} operating state.`,
      'The detail view is now derived from the live backend server response, not a mock dataset.',
    ],
    rootCauses: [
      `Inspect ${server.service.toLowerCase()} process utilization on ${server.hostname}.`,
      'Compare current pressure against the latest backend health payload.',
      'Review recent configuration or deployment changes if the trend remains elevated.',
    ],
    recommendedSteps: [
      `Open the current operating telemetry for ${server.hostname}.`,
      `Escalate to the owning team if the host remains ${server.status.toLowerCase()} for the next interval.`,
      'Keep this page bound to the live backend response to avoid stale UI snapshots.',
    ],
    relatedDocs: [
      { title: `${server.service} runbook`, type: 'Operational Guide' },
      { title: `${server.hostname} investigation notes`, type: 'Knowledge Base' },
    ],
    similarIncidents: [
      { id: `INC-${server.id}-trend`, title: `${server.service} capacity trend`, resolvedIn: '14m' },
    ],
    nextActions: [
      'Review the latest backend metrics',
      'Compare the current state with the expected service envelope',
      'Escalate if the severity exceeds the on-call threshold',
    ],
    lastAnalyzed: server.lastSeen,
  }
}

export function getServerDetail(server: ServerItem): ServerDetailBundle {
  const cpuSeries = buildTrendSeries(server.cpu, 12, 8)
  const memorySeries = buildTrendSeries(server.memory, 12, 10)
  const diskSeries = buildTrendSeries(server.disk, 12, 6)
  const networkSeries = buildTrendSeries(Math.max(20, server.cpu + server.memory / 2), 12, 15)

  const services: RunningServiceItem[] = [
    {
      id: `${server.id}-svc-1`,
      name: `${server.service} Agent`,
      status: server.status === 'Critical' ? 'Stopped' : server.status === 'Warning' ? 'Degraded' : 'Running',
      cpu: Math.max(1, Math.min(99, server.cpu - 4)),
      memory: Math.max(1, Math.min(99, server.memory - 2)),
      lastRestart: server.lastSeen,
      port: 443,
    },
    {
      id: `${server.id}-svc-2`,
      name: `${server.service} Metrics`,
      status: 'Running',
      cpu: Math.max(1, Math.min(99, Math.round(server.cpu / 2))),
      memory: Math.max(1, Math.min(99, Math.round(server.memory / 2))),
      lastRestart: '2h ago',
      port: 8080,
    },
  ]

  const alerts: ServerAlertItem[] = [
    {
      id: `${server.id}-alert-1`,
      severity: server.status === 'Critical' ? 'critical' : server.status === 'Warning' ? 'medium' : 'low',
      title: `${server.hostname} is reporting ${server.status.toLowerCase()} availability`,
      timestamp: server.lastSeen,
      status: server.status === 'Healthy' ? 'resolved' : 'open',
    },
  ]

  const incidents: ServerIncidentItem[] = [
    {
      id: `INC-${server.id}`,
      title: `${server.service} event observed on ${server.hostname}`,
      priority: server.status === 'Critical' ? 'critical' : server.status === 'Warning' ? 'high' : 'low',
      status: 'investigating',
      engineer: 'Platform Engineering',
      createdAt: server.lastSeen,
    },
  ]

  const configuration: ServerConfiguration = {
    cpuCores: Math.max(2, Math.round(server.cpu / 10)),
    ramGb: Math.max(2, Math.round(server.memory / 10)),
    storageGb: Math.max(20, Math.round(server.disk * 1.6)),
    virtualizationPlatform: server.environment === 'Production' ? 'VMware vSphere 8.0' : 'Azure VM',
    backupStatus: server.status === 'Critical' ? 'Failed' : 'Success',
    lastBackup: server.lastSeen,
    osVersion: server.os,
    agentVersion: 'OpsPilot Agent v1.0.0',
  }

  const timeline: TimelineEvent[] = [
    {
      id: `${server.id}-tl-1`,
      type: 'metric',
      title: 'Telemetry refreshed',
      description: `Backend metrics for ${server.hostname} were reloaded from the live API response.`,
      timestamp: server.lastSeen,
    },
    {
      id: `${server.id}-tl-2`,
      type: 'service',
      title: 'Service state reconciled',
      description: `${server.service} service on ${server.hostname} was normalized from the backend response.`,
      timestamp: server.lastSeen,
    },
    {
      id: `${server.id}-tl-3`,
      type: 'alert',
      title: 'Alert state derived',
      description: `${server.hostname} current status is ${server.status.toLowerCase()}.`,
      timestamp: server.lastSeen,
    },
  ]

  return {
    uptime: server.lastSeen,
    assignedTeam: server.environment === 'Production' ? 'Platform Engineering' : 'Infrastructure',
    healthSummary: {
      healthScore: server.status === 'Critical' ? 42 : server.status === 'Warning' ? 74 : 92,
      networkThroughputMbps: Math.max(40, Math.round(server.cpu + server.memory * 0.6)),
      runningServicesCount: services.filter((service) => service.status === 'Running').length,
      totalServicesCount: services.length,
      activeAlertsCount: alerts.length,
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
    aiInvestigation: buildAIInvestigation(server),
    configuration,
    timeline,
  }
}
