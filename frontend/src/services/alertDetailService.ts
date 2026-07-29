/**
 * Alert Details access layer.
 *
 * `getAlertDetail(alert, server)` is where a FastAPI call will go in
 * production — e.g. `GET /api/alerts/{id}/detail` — returning this same
 * `AlertDetailBundle` shape. Every UI component reads only from that
 * shape, so swapping this generator for a real fetch won't require
 * touching any component.
 *
 * The generator is deterministic (seeded from the alert id via
 * utils/mockDataGenerators) rather than random, so a given alert always
 * renders the same "realistic" mock data across reloads.
 */

import type { AlertItem } from '../types/alert'
import type { ServerItem } from '../types/server'
import type { IncidentPriority, IncidentStatus } from '../types/incident'
import type { ServiceStatus } from '../types/serverDetail'
import type { AlertAIInvestigation, AlertDetailBundle, AlertTimelineEvent, RelatedIncidentRef } from '../types/alertDetail'
import { clamp, hashCode, pick, buildSeries } from '../utils/mockDataGenerators'
import {
  ALERT_DOC_POOL,
  CLUSTER_PREFIXES,
  IMPACT_POOL,
  INCIDENT_TITLE_TEMPLATES,
  INVESTIGATION_STEPS_POOL,
  RELATED_INCIDENT_ENGINEERS,
  RISK_POOL,
  ROOT_CAUSE_POOL,
  TIMELINE_ACK_OFFSETS,
  TIMELINE_INCIDENT_OFFSETS,
  TIMELINE_RESOLVED_OFFSETS,
} from '../data/alertDetail'

function serviceStatusFor(alert: AlertItem): ServiceStatus {
  if (alert.status === 'Resolved') return 'Running'
  if (alert.severity === 'Critical') return 'Stopped'
  if (alert.severity === 'High') return 'Degraded'
  return 'Running'
}

function buildTimeline(alert: AlertItem, seed: number, engineer: string): AlertTimelineEvent[] {
  const host = alert.affectedServerHostname
  const pastAcknowledgement = alert.status === 'Acknowledged' || alert.status === 'Investigating' || alert.status === 'Resolved'
  const isResolved = alert.status === 'Resolved'
  // Deterministically decide whether this alert's story includes an incident being opened.
  const hasIncident = pastAcknowledgement && seed % 2 === 0

  const events: AlertTimelineEvent[] = [
    {
      id: `${alert.id}-tl-1`,
      type: 'triggered',
      title: 'Alert Triggered',
      description: `${alert.name} fired for ${host} via ${alert.source}.`,
      timestamp: alert.triggerTime,
    },
    {
      id: `${alert.id}-tl-2`,
      type: 'threshold',
      title: `${alert.name.includes('CPU') ? 'CPU' : 'Monitored metric'} exceeded threshold`,
      description: `The condition crossed its configured threshold on ${host}.`,
      timestamp: alert.triggerTime,
    },
  ]

  if (pastAcknowledgement) {
    events.push({
      id: `${alert.id}-tl-3`,
      type: 'acknowledged',
      title: 'Engineer acknowledged',
      description: `${engineer} acknowledged the alert and began triage.`,
      timestamp: pick(TIMELINE_ACK_OFFSETS, seed),
    })
  }

  if (hasIncident) {
    events.push({
      id: `${alert.id}-tl-4`,
      type: 'incident',
      title: 'Incident created',
      description: `An incident was opened to track investigation and resolution.`,
      timestamp: pick(TIMELINE_INCIDENT_OFFSETS, seed),
    })
  }

  if (isResolved) {
    events.push({
      id: `${alert.id}-tl-5`,
      type: 'resolved',
      title: 'Alert resolved',
      description: `Metrics on ${host} returned to baseline; alert marked resolved.`,
      timestamp: pick(TIMELINE_RESOLVED_OFFSETS, seed),
    })
  }

  return events
}

function buildAIInvestigation(alert: AlertItem, seed: number): AlertAIInvestigation {
  const host = alert.affectedServerHostname
  const risk = RISK_POOL[alert.severity]

  return {
    summary: `${alert.name} fired on ${host} (${alert.environment}) via ${alert.source}. ${IMPACT_POOL[alert.severity]}`,
    possibleRootCauses: ROOT_CAUSE_POOL[alert.severity],
    likelyImpact: IMPACT_POOL[alert.severity],
    investigationSteps: INVESTIGATION_STEPS_POOL[alert.severity],
    recommendedDocs: [pick(ALERT_DOC_POOL, seed), pick(ALERT_DOC_POOL, seed + 2)],
    riskLevel: risk.level,
    riskAssessment: risk.assessment,
    lastAnalyzed: alert.status === 'Resolved' ? pick(['1h ago', '2h ago', '3h ago'], seed) : 'Just now',
  }
}

function buildRelatedIncidents(alert: AlertItem, seed: number, engineer: string): RelatedIncidentRef[] {
  const pastAcknowledgement = alert.status === 'Acknowledged' || alert.status === 'Investigating' || alert.status === 'Resolved'
  if (!pastAcknowledgement) return []

  const priority: IncidentPriority = alert.severity === 'Informational' ? 'Low' : (alert.severity as IncidentPriority)
  const status: IncidentStatus = alert.status === 'Resolved' ? 'Resolved' : 'Investigating'

  return [
    {
      id: `INC-${2000 + (seed % 900)}`,
      title: pick(INCIDENT_TITLE_TEMPLATES, seed).replace('{alertName}', alert.name).replace('{host}', alert.affectedServerHostname),
      priority,
      status,
      engineer,
      createdAt: pick(['Today, 09:12', 'Today, 07:40', 'Yesterday, 22:05', '2 days ago'], seed),
    },
  ]
}

export function getAlertDetail(alert: AlertItem, server: ServerItem | undefined): AlertDetailBundle {
  const seed = hashCode(alert.id)
  const service = server?.service ?? 'Web'

  // --- Health summary & metric series --------------------------------------
  const cpu = server?.cpu ?? clamp(45 + (seed % 50), 1, 99)
  const memory = server?.memory ?? clamp(40 + (seed % 50), 1, 99)
  const disk = server?.disk ?? clamp(25 + (seed % 55), 1, 99)
  const networkBase = 80 + (seed % 260)

  const cpuSeries = buildSeries(seed, cpu, 14, 1, 99)
  const memorySeries = buildSeries(seed + 3, memory, 12, 1, 99)
  const diskSeries = buildSeries(seed + 6, disk, 4, 1, 99)
  const networkSeries = buildSeries(seed + 9, networkBase, 60, 5, 900)

  // --- Affected resource -----------------------------------------------
  const clusterPrefix = CLUSTER_PREFIXES[service] ?? 'app-cluster'
  const clusterNumber = 1 + (seed % 3)

  // --- Engineer / acknowledgement ----------------------------------------
  const pastAcknowledgement = alert.status === 'Acknowledged' || alert.status === 'Investigating' || alert.status === 'Resolved'
  const engineer = pick(RELATED_INCIDENT_ENGINEERS, seed)

  return {
    healthSummary: {
      cpu,
      memory,
      disk,
      networkThroughputMbps: networkBase,
      serviceName: service,
      serviceStatus: serviceStatusFor(alert),
    },
    affectedResource: {
      hostname: alert.affectedServerHostname,
      cluster: `${clusterPrefix}-${String(clusterNumber).padStart(2, '0')}`,
      environment: alert.environment,
      region: server?.location ?? 'East US',
      ipAddress: server?.ipAddress ?? '10.10.0.10',
    },
    timeline: buildTimeline(alert, seed, engineer),
    metrics: {
      cpu: cpuSeries,
      memory: memorySeries,
      disk: diskSeries,
      network: networkSeries,
    },
    relatedIncidents: buildRelatedIncidents(alert, seed, engineer),
    relatedDocs: [pick(ALERT_DOC_POOL, seed + 1), pick(ALERT_DOC_POOL, seed + 4), pick(ALERT_DOC_POOL, seed + 6)],
    aiInvestigation: buildAIInvestigation(alert, seed),
    acknowledgedBy: pastAcknowledgement ? engineer : null,
    acknowledgedAt: pastAcknowledgement ? pick(['8m ago', '15m ago', '32m ago', '1h ago'], seed) : null,
  }
}
