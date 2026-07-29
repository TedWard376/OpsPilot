/**
 * Mock content for the Incident Details page — pure content only.
 * See services/incidentDetailService.ts for the generator function
 * (getIncidentDetail) and the live timeline helpers.
 */

import type { IncidentPriority, IncidentStatus } from '../types/incident'
import type { RelatedAlertSeverity, RelatedAlertStatus } from '../types/incidentDetail'

export const TIMELINE_LABELS = ['Detected', 'Acknowledged', 'Investigating', 'Monitoring', 'Resolved'] as const

export const ALERT_SEVERITY_BY_PRIORITY: Record<IncidentPriority, RelatedAlertSeverity> = {
  Critical: 'critical',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
}

export const ALERT_STATUS_BY_INCIDENT_STATUS: Record<IncidentStatus, RelatedAlertStatus> = {
  Open: 'open',
  Investigating: 'investigating',
  Monitoring: 'acknowledged',
  Resolved: 'resolved',
  Closed: 'resolved',
}

export const DOC_POOL = [
  { title: 'Runbook: Incident Triage Checklist', type: 'Runbook' },
  { title: 'Playbook: Priority-Based Escalation', type: 'Playbook' },
  { title: 'Guide: Root Cause Analysis Template', type: 'Guide' },
  { title: 'Runbook: Rollback Procedures', type: 'Runbook' },
  { title: 'Architecture: Production Network Topology', type: 'Reference' },
] as const
