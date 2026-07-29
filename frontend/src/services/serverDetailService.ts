/**
 * Server Details access layer.
 *
 * `getServerDetail(server)` is where a FastAPI call will go in production —
 * e.g. `GET /api/servers/{id}/detail` — returning this same
 * `ServerDetailBundle` shape. Every UI component reads only from that
 * shape, so swapping this generator for a real fetch won't require
 * touching any component.
 *
 * The generator is deterministic (seeded from the server id via
 * utils/mockDataGenerators) rather than random, so a given server always
 * renders the same "realistic" mock data across reloads.
 */

import type { ServerItem, ServerStatus } from '../types/server'
import type {
  AIInvestigationData,
  RunningServiceItem,
  ServerAlertItem,
  ServerConfiguration,
  ServerDetailBundle,
  ServerIncidentItem,
  ServiceStatus,
  TimelineEvent,
} from '../types/serverDetail'
import { clamp, hashCode, pick, buildSeries } from '../utils/mockDataGenerators'
import {
  ALERT_POOL,
  ASSIGNED_ENGINEERS,
  DEFAULT_SPEC,
  DOC_POOL,
  INCIDENT_POOL,
  RESTART_WINDOWS,
  SERVICE_STACKS,
  SPECS_BY_SERVICE,
} from '../data/serverDetail'

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
    Warning: [`${driver} usage is trending upward over the last 6 hours.`, `Other resource metrics on ${host} remain within normal range.`],
    Healthy: [`All monitored metrics are within expected operating range.`, `No alerts have fired for ${host} in the current window.`],
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
    Warning: [`Monitor ${driver.toLowerCase()} trend over the next few hours.`, `Review scheduled jobs running on ${host} during the affected window.`],
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
    engineer: pick(ASSIGNED_ENGINEERS, seed + i),
    createdAt: pick(['Today, 09:12', 'Today, 07:40', 'Yesterday, 22:05', '2 days ago'], seed + i),
  }))

  // --- Health summary -----------------------------------------------------
  const statusScoreBase = server.status === 'Healthy' ? 92 : server.status === 'Warning' ? 74 : 48
  const healthScore = clamp(statusScoreBase + (seed % 7) - 3, 1, 99)
  const runningServicesCount = services.filter((s) => s.status === 'Running').length

  // --- Configuration --------------------------------------------------
  const specs = SPECS_BY_SERVICE[server.service] ?? DEFAULT_SPEC
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
