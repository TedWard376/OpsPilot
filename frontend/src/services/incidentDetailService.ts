/**
 * Incident Details access layer.
 *
 * `getIncidentDetail(incident)` is where a FastAPI call will go in
 * production — e.g. `GET /api/incidents/{id}/detail` — returning this same
 * `IncidentDetailBundle` shape.
 *
 * `buildTimelineStages`, `stageIndexForStatus`, `statusLabelForStage`, and
 * `getTimelineStageLabels` are exported separately (not just used inside
 * `getIncidentDetail`) because the Incident Details page calls them live,
 * as the user advances through investigation stages — that interactivity
 * needs the same stage logic the initial page load used.
 *
 * Resolves affected servers via `serverService.getAllServers()` rather
 * than reading `data/servers.ts` directly — one service composing with
 * another's public API instead of reaching into its data, the same rule
 * a real backend's IncidentService would follow with a ServerRepository.
 */

import type { ServerItem } from '../types/server'
import type { IncidentItem, IncidentPriority, IncidentStatus } from '../types/incident'
import type {
  ActivityLogEntry,
  AffectedServerRef,
  IncidentDetailBundle,
  InvestigationNote,
  RelatedAlertRef,
  ResolutionInfo,
  TimelineStage,
  TimelineStageState,
} from '../types/incidentDetail'
import type { AIInvestigationData } from '../types/serverDetail'
import { clamp, hashCode, pick, buildSeries } from '../utils/mockDataGenerators'
import { ALERT_SEVERITY_BY_PRIORITY, ALERT_STATUS_BY_INCIDENT_STATUS, DOC_POOL, TIMELINE_LABELS } from '../data/incidentDetail'
import { getAllServers } from './serverService'

// ---------------------------------------------------------------------------
// Timeline stage helpers (also called live by the Incident Details page)
// ---------------------------------------------------------------------------

export function getTimelineStageLabels(): readonly string[] {
  return TIMELINE_LABELS
}

export function stageIndexForStatus(status: IncidentStatus): number {
  switch (status) {
    case 'Open':
      return 1
    case 'Investigating':
      return 2
    case 'Monitoring':
      return 3
    case 'Resolved':
    case 'Closed':
      return 4
    default:
      return 0
  }
}

/**
 * Pure, stage-index-driven timeline builder. Used both to seed the initial
 * mock bundle and to re-render the timeline live as the user advances
 * stages or resolves the incident on the detail page.
 */
export function buildTimelineStages(
  stageIndex: number,
  isResolved: boolean,
  timestamps: { created: string; updated: string },
): TimelineStage[] {
  const lastIndex = TIMELINE_LABELS.length - 1

  return TIMELINE_LABELS.map((label, index) => {
    let state: TimelineStageState
    if (index < stageIndex || (index === lastIndex && isResolved)) {
      state = 'complete'
    } else if (index === stageIndex) {
      state = 'current'
    } else {
      state = 'pending'
    }

    const timestamp = index === 0 ? timestamps.created : state !== 'pending' ? timestamps.updated : null
    return { id: label.toLowerCase(), label, state, timestamp }
  })
}

/** Inverse of stageIndexForStatus — used to keep the status badge in sync as the user advances the live timeline. */
export function statusLabelForStage(stageIndex: number, isResolved: boolean): IncidentStatus {
  if (isResolved) return 'Resolved'
  if (stageIndex <= 1) return 'Open'
  if (stageIndex === 2) return 'Investigating'
  return 'Monitoring'
}

function buildTimeline(incident: IncidentItem): TimelineStage[] {
  const currentIndex = stageIndexForStatus(incident.status)
  const isResolved = incident.status === 'Resolved' || incident.status === 'Closed'
  return buildTimelineStages(currentIndex, isResolved, { created: incident.createdAt, updated: incident.updatedAt })
}

// ---------------------------------------------------------------------------
// Affected servers
// ---------------------------------------------------------------------------

const SYSTEM_TO_SERVICE: Record<string, string[]> = {
  'API Gateway': ['API'],
  'Database Cluster': ['Database'],
  'Cache Layer': ['Cache'],
  'Worker Pool': ['Worker'],
  'Auth Service': ['Auth'],
  'Object Storage': ['Object Storage'],
  'Storage Pool': ['File Storage'],
  'Kubernetes Cluster': ['Kubernetes'],
  'Monitoring Stack': ['Monitoring'],
  'Web Tier': ['Web'],
}

function pickAffectedServers(incident: IncidentItem, seed: number): AffectedServerRef[] {
  const allServers = getAllServers()

  // Primary path: incidents carry explicit server references from the
  // Create Incident form (or curated seed data).
  if (incident.affectedServerIds.length > 0) {
    const chosen = incident.affectedServerIds
      .map((id) => allServers.find((server) => server.id === id))
      .filter((server): server is ServerItem => Boolean(server))

    if (chosen.length > 0) {
      return chosen.map((server, i) => ({ server, role: i === 0 ? 'Primary' : 'Secondary' }))
    }
  }

  // Fallback heuristic for incidents without explicit server references.
  const wantedServices = new Set(incident.affectedSystems.flatMap((system) => SYSTEM_TO_SERVICE[system] ?? []))
  const candidates = allServers.filter((server) => wantedServices.has(server.service))
  const pool = candidates.length > 0 ? candidates : allServers

  const count = clamp(1 + (seed % 3), 1, Math.min(3, pool.length))
  const chosen: ServerItem[] = []
  for (let i = 0; i < count; i++) {
    const server = pool[(seed + i * 7) % pool.length]
    if (!chosen.some((s) => s.id === server.id)) chosen.push(server)
  }

  return chosen.map((server, i) => ({ server, role: i === 0 ? 'Primary' : 'Secondary' }))
}

// ---------------------------------------------------------------------------
// Activity log
// ---------------------------------------------------------------------------

function buildActivityLog(incident: IncidentItem, seed: number, primaryServerHostname: string): ActivityLogEntry[] {
  const entries: ActivityLogEntry[] = [
    {
      id: `${incident.id}-log-1`,
      type: 'system',
      actor: 'OpsPilot Monitoring',
      action: `Anomaly detected on ${primaryServerHostname}, incident auto-created.`,
      timestamp: incident.createdAt,
    },
    {
      id: `${incident.id}-log-2`,
      type: 'assignment',
      actor: 'OpsPilot',
      action: `Incident assigned to ${incident.assignedEngineer}.`,
      timestamp: incident.createdAt,
    },
    {
      id: `${incident.id}-log-3`,
      type: 'alert',
      actor: 'Alert Engine',
      action: `${pick(['2', '3', '4'], seed)} related alerts linked to this incident.`,
      timestamp: incident.createdAt,
    },
  ]

  if (incident.status !== 'Open') {
    entries.push({
      id: `${incident.id}-log-4`,
      type: 'status',
      actor: incident.assignedEngineer,
      action: `Status changed to ${incident.status}.`,
      timestamp: incident.updatedAt,
    })
  }

  entries.push({
    id: `${incident.id}-log-5`,
    type: 'comment',
    actor: incident.assignedEngineer,
    action: 'Began triage and pulled recent metrics for the affected systems.',
    timestamp: incident.updatedAt,
  })

  if (incident.status === 'Resolved' || incident.status === 'Closed') {
    entries.push({
      id: `${incident.id}-log-6`,
      type: 'status',
      actor: incident.assignedEngineer,
      action: 'Marked incident as resolved.',
      timestamp: incident.updatedAt,
    })
  }

  return entries
}

// ---------------------------------------------------------------------------
// Investigation notes
// ---------------------------------------------------------------------------

function buildNotes(incident: IncidentItem, seed: number): InvestigationNote[] {
  const openingNoteByPriority: Record<IncidentPriority, string> = {
    Critical: `Paged in immediately. Confirming blast radius across ${incident.affectedSystems.join(', ')} before making any changes.`,
    High: `Started investigating — checking recent deploys and config changes to ${incident.affectedSystems[0]}.`,
    Medium: `Reviewing metrics trend for ${incident.affectedSystems[0]}. No customer impact confirmed yet.`,
    Low: `Logged for tracking. Will monitor and follow up if it escalates.`,
  }

  const notes: InvestigationNote[] = [
    {
      id: `${incident.id}-note-1`,
      author: incident.assignedEngineer,
      timestamp: incident.createdAt,
      content: openingNoteByPriority[incident.priority],
    },
  ]

  if (incident.status === 'Investigating' || incident.status === 'Monitoring') {
    notes.push({
      id: `${incident.id}-note-2`,
      author: incident.assignedEngineer,
      timestamp: incident.updatedAt,
      content: pick(
        [
          'Narrowed it down to resource saturation on the primary node. Evaluating scale-up vs. restart.',
          'No config drift found. Suspect load-driven — checking traffic patterns for the last hour.',
          'Mitigation applied, watching metrics closely before downgrading severity.',
        ],
        seed,
      ),
    })
  }

  return notes
}

// ---------------------------------------------------------------------------
// Related alerts
// ---------------------------------------------------------------------------

function buildRelatedAlerts(incident: IncidentItem, seed: number): RelatedAlertRef[] {
  const severity = ALERT_SEVERITY_BY_PRIORITY[incident.priority]
  const status = ALERT_STATUS_BY_INCIDENT_STATUS[incident.status]
  const count = clamp(2 + (seed % 3), 2, 4)

  const templates = [
    (system: string) => `Threshold breach detected on ${system}`,
    (system: string) => `Elevated error rate on ${system}`,
    (system: string) => `Response latency spike on ${system}`,
    (system: string) => `Health check failing on ${system}`,
  ]

  return Array.from({ length: count }, (_, i) => {
    const system = incident.affectedSystems[i % incident.affectedSystems.length]
    return {
      id: `${incident.id}-alert-${i}`,
      title: templates[(seed + i) % templates.length](system),
      severity: i === 0 ? severity : pick(['critical', 'high', 'medium', 'low'] as const, seed + i),
      status,
      timestamp: pick(['5m ago', '18m ago', '42m ago', '1h 10m ago', '2h ago'], seed + i),
      source: system,
    }
  })
}

// ---------------------------------------------------------------------------
// AI investigation
// ---------------------------------------------------------------------------

function buildAIInvestigation(incident: IncidentItem, seed: number, primaryServerHostname: string): AIInvestigationData {
  const systems = incident.affectedSystems.join(', ')

  const summaryByStatus: Record<IncidentStatus, string> = {
    Open: `${incident.title} was just detected affecting ${systems}. No triage has started yet — recommend immediate acknowledgment given ${incident.priority.toLowerCase()} priority.`,
    Investigating: `Active investigation underway for ${incident.title}. Primary suspect is ${primaryServerHostname}; impact is currently scoped to ${systems}.`,
    Monitoring: `Mitigation has been applied for ${incident.title}. Metrics are being watched on ${systems} to confirm full recovery.`,
    Resolved: `${incident.title} has been resolved. Impact was limited to ${systems} with no further action required beyond the postmortem.`,
    Closed: `${incident.title} is closed. Root cause and remediation are documented for future reference.`,
  }

  const observations = [
    `${incident.priority} priority incident impacting ${incident.affectedSystems.length} system${incident.affectedSystems.length > 1 ? 's' : ''}.`,
    `${primaryServerHostname} shows the strongest correlation with the reported symptoms.`,
    `Related alerts began firing around ${incident.createdAt}.`,
  ]

  const rootCauses = [
    `Resource saturation on ${primaryServerHostname} during peak load.`,
    `Possible regression introduced by a recent deployment to ${incident.affectedSystems[0]}.`,
    `Downstream dependency slowdown propagating to ${systems}.`,
  ]

  const recommendedSteps = [
    `Review recent deploys and config changes to ${incident.affectedSystems[0]}.`,
    `Inspect resource utilization on ${primaryServerHostname} for the incident window.`,
    `Correlate with related alerts to confirm scope before rolling out a fix.`,
    `Prepare a rollback plan if a recent change is implicated.`,
  ]

  return {
    summary: summaryByStatus[incident.status],
    observations,
    rootCauses,
    recommendedSteps,
    relatedDocs: [pick(DOC_POOL, seed), pick(DOC_POOL, seed + 2)],
    similarIncidents: [
      {
        id: `INC-${1500 + (seed % 400)}`,
        title: `${incident.title.split(' ').slice(0, 4).join(' ')} (similar pattern)`,
        resolvedIn: pick(['32m', '58m', '1h 20m', '2h 10m'], seed),
      },
    ],
    nextActions:
      incident.status === 'Resolved' || incident.status === 'Closed'
        ? ['File postmortem if not already complete.', 'Confirm monitoring thresholds were adjusted if needed.']
        : ['Confirm assignment and acknowledge the incident.', 'Escalate to secondary on-call if unresolved within SLA.', 'Post an update in the incident channel.'],
    lastAnalyzed: 'Just now',
  }
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

function buildResolution(incident: IncidentItem, primaryServerHostname: string): ResolutionInfo {
  const isResolved = incident.status === 'Resolved' || incident.status === 'Closed'

  return {
    isResolved,
    rootCause: isResolved ? `Resource exhaustion on ${primaryServerHostname} triggered by an unexpected load increase.` : '',
    resolutionSummary: isResolved
      ? `Mitigated by scaling ${primaryServerHostname} and clearing the backlog. Verified metrics returned to baseline before closing.`
      : '',
    resolvedBy: isResolved ? incident.assignedEngineer : null,
    resolvedAt: isResolved ? incident.updatedAt : null,
  }
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function getIncidentDetail(incident: IncidentItem): IncidentDetailBundle {
  const seed = hashCode(incident.id)
  const affectedServers = pickAffectedServers(incident, seed)
  const primaryServer = affectedServers[0]?.server
  const primaryServerHostname = primaryServer?.hostname ?? incident.affectedSystems[0]

  const cpuBase = primaryServer?.cpu ?? 55
  const memoryBase = primaryServer?.memory ?? 55
  const networkBase = 80 + (seed % 260)

  return {
    timeline: buildTimeline(incident),
    activityLog: buildActivityLog(incident, seed, primaryServerHostname),
    notes: buildNotes(incident, seed),
    affectedServers,
    relatedAlerts: buildRelatedAlerts(incident, seed),
    metrics: {
      cpu: buildSeries(seed, cpuBase, 14, 1, 99),
      memory: buildSeries(seed + 3, memoryBase, 12, 1, 99),
      network: buildSeries(seed + 9, networkBase, 60, 5, 900),
    },
    aiInvestigation: buildAIInvestigation(incident, seed, primaryServerHostname),
    resolution: buildResolution(incident, primaryServerHostname),
  }
}
