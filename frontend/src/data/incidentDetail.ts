/**
 * Mock data layer for the Incident Details page.
 *
 * `getIncidentDetail(incident)` is where a FastAPI call will go in
 * production — e.g. `GET /api/incidents/{id}/detail` — returning this same
 * `IncidentDetailBundle` shape. Components only ever read from that shape.
 *
 * Reuses `TimeSeriesPoint` / `AIInvestigationData` from serverDetail.ts so
 * the Incident Details page can reuse the same chart and AI-panel
 * components as the Server Details page, and links to real servers from
 * servers.ts so "Affected Servers" rows navigate to real server pages.
 */

import type { ServerItem } from './servers'
import { serversData } from './servers'
import type { IncidentItem, IncidentPriority, IncidentStatus } from './incidents'
import type { AIInvestigationData, TimeSeriesPoint } from './serverDetail'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TimelineStageState = 'complete' | 'current' | 'pending'

export interface TimelineStage {
  id: string
  label: string
  state: TimelineStageState
  timestamp: string | null
}

export type ActivityLogType = 'status' | 'comment' | 'alert' | 'assignment' | 'system'

export interface ActivityLogEntry {
  id: string
  type: ActivityLogType
  actor: string
  action: string
  timestamp: string
}

export interface InvestigationNote {
  id: string
  author: string
  timestamp: string
  content: string
}

export type AffectedServerRole = 'Primary' | 'Secondary'

export interface AffectedServerRef {
  server: ServerItem
  role: AffectedServerRole
}

export type RelatedAlertSeverity = 'critical' | 'high' | 'medium' | 'low'
export type RelatedAlertStatus = 'open' | 'investigating' | 'acknowledged' | 'resolved'

export interface RelatedAlertRef {
  id: string
  title: string
  severity: RelatedAlertSeverity
  status: RelatedAlertStatus
  timestamp: string
  source: string
}

export interface ResolutionInfo {
  isResolved: boolean
  rootCause: string
  resolutionSummary: string
  resolvedBy: string | null
  resolvedAt: string | null
}

export interface IncidentDetailBundle {
  timeline: TimelineStage[]
  activityLog: ActivityLogEntry[]
  notes: InvestigationNote[]
  affectedServers: AffectedServerRef[]
  relatedAlerts: RelatedAlertRef[]
  metrics: {
    cpu: TimeSeriesPoint[]
    memory: TimeSeriesPoint[]
    network: TimeSeriesPoint[]
  }
  aiInvestigation: AIInvestigationData
  resolution: ResolutionInfo
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

function buildSeries(seed: number, current: number, amplitude: number, min: number, max: number): TimeSeriesPoint[] {
  const raw = SERIES_TIMES.map((_, i) => Math.sin((i + seed) * 0.55) * amplitude)
  const offset = current - raw[raw.length - 1]
  return SERIES_TIMES.map((time, i) => ({
    time,
    value: Math.round(clamp(raw[i] + offset, min, max)),
  }))
}

// ---------------------------------------------------------------------------
// Affected system → server mapping
// ---------------------------------------------------------------------------

const SYSTEM_TO_SERVICE: Record<string, string[]> = {
  'API Gateway': ['API', 'Web'],
  'Database Cluster': ['Database'],
  'Cache Layer': ['Cache'],
  'Message Queue': ['Worker'],
  'Auth Service': ['Auth'],
  'Object Storage': ['Object Storage'],
  'Load Balancer': ['Web'],
  'Storage Pool': ['File Storage'],
  'Kubernetes Cluster': ['Kubernetes'],
  'DNS Service': ['Monitoring'],
  Network: ['Web', 'API'],
}

function pickAffectedServers(incident: IncidentItem, seed: number): AffectedServerRef[] {
  const wantedServices = new Set(incident.affectedSystems.flatMap((system) => SYSTEM_TO_SERVICE[system] ?? []))
  const candidates = serversData.filter((server) => wantedServices.has(server.service))
  const pool = candidates.length > 0 ? candidates : serversData

  const count = clamp(1 + (seed % 3), 1, Math.min(3, pool.length))
  const chosen: ServerItem[] = []
  for (let i = 0; i < count; i++) {
    const server = pool[(seed + i * 7) % pool.length]
    if (!chosen.some((s) => s.id === server.id)) chosen.push(server)
  }

  return chosen.map((server, i) => ({ server, role: i === 0 ? 'Primary' : 'Secondary' }))
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export const TIMELINE_LABELS = ['Detected', 'Acknowledged', 'Investigating', 'Monitoring', 'Resolved'] as const

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

function buildTimeline(incident: IncidentItem): TimelineStage[] {
  const currentIndex = stageIndexForStatus(incident.status)
  const isResolved = incident.status === 'Resolved' || incident.status === 'Closed'
  return buildTimelineStages(currentIndex, isResolved, { created: incident.createdAt, updated: incident.updatedAt })
}

/** Inverse of stageIndexForStatus — used to keep the status badge in sync as the user advances the live timeline. */
export function statusLabelForStage(stageIndex: number, isResolved: boolean): IncidentStatus {
  if (isResolved) return 'Resolved'
  if (stageIndex <= 1) return 'Open'
  if (stageIndex === 2) return 'Investigating'
  return 'Monitoring'
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

const ALERT_SEVERITY_BY_PRIORITY: Record<IncidentPriority, RelatedAlertSeverity> = {
  Critical: 'critical',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
}

const ALERT_STATUS_BY_INCIDENT_STATUS: Record<IncidentStatus, RelatedAlertStatus> = {
  Open: 'open',
  Investigating: 'investigating',
  Monitoring: 'acknowledged',
  Resolved: 'resolved',
  Closed: 'resolved',
}

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

const DOC_POOL = [
  { title: 'Runbook: Incident Triage Checklist', type: 'Runbook' },
  { title: 'Playbook: Priority-Based Escalation', type: 'Playbook' },
  { title: 'Guide: Root Cause Analysis Template', type: 'Guide' },
  { title: 'Runbook: Rollback Procedures', type: 'Runbook' },
  { title: 'Architecture: Production Network Topology', type: 'Reference' },
] as const

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
    rootCause: isResolved
      ? `Resource exhaustion on ${primaryServerHostname} triggered by an unexpected load increase.`
      : '',
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
