/**
 * Mock content for the Alert Details page — pure content only.
 * See services/alertDetailService.ts for the generator function
 * (getAlertDetail) that turns this content into an AlertDetailBundle.
 */

import type { AlertSeverity } from '../types/alert'
import type { AlertRiskLevel } from '../types/alertDetail'

// ---------------------------------------------------------------------------
// Cluster naming per workload type — used to derive a realistic
// "Affected Resources" cluster label from the server's service type.
// ---------------------------------------------------------------------------

export const CLUSTER_PREFIXES: Record<string, string> = {
  Web: 'web-cluster',
  API: 'api-cluster',
  Database: 'db-cluster',
  Cache: 'cache-cluster',
  Auth: 'auth-cluster',
  'File Storage': 'storage-cluster',
  Kubernetes: 'k8s-cluster',
  Monitoring: 'monitoring-cluster',
  Worker: 'worker-cluster',
  'Object Storage': 'object-storage-cluster',
}

// ---------------------------------------------------------------------------
// AI investigation content, keyed by alert severity
// ---------------------------------------------------------------------------

export const ROOT_CAUSE_POOL: Record<AlertSeverity, string[]> = {
  Critical: [
    'A resource leak or runaway process consuming CPU, memory, or disk beyond expected limits.',
    'A recent deployment or configuration change that altered resource behavior on the affected server.',
    'Undersized infrastructure for current production load.',
  ],
  High: [
    'Gradual load growth outpacing the current instance size.',
    'A background job or scheduled task consuming more resources than expected.',
    'A dependency (database, cache, or upstream service) responding slower than usual.',
  ],
  Medium: [
    'A transient spike in traffic or scheduled workload.',
    'Configuration drift from the baseline for this service.',
  ],
  Low: ['A minor deviation from baseline that is within normal operating variance.'],
  Informational: ['Routine, expected system behavior — no underlying issue identified.'],
}

export const IMPACT_POOL: Record<AlertSeverity, string> = {
  Critical: 'High likelihood of customer-facing service degradation or an outage if left unaddressed.',
  High: 'Moderate risk of service degradation; customer impact is possible if the trend continues.',
  Medium: 'Low immediate customer impact, but the underlying condition should be tracked.',
  Low: 'Minimal to no expected impact on service availability or performance.',
  Informational: 'No expected impact — informational only.',
}

export const RISK_POOL: Record<AlertSeverity, { level: AlertRiskLevel; assessment: string }> = {
  Critical: {
    level: 'Critical',
    assessment: 'Immediate investigation recommended. Sustained conditions at this severity carry meaningful risk of an SLA-impacting outage.',
  },
  High: {
    level: 'High',
    assessment: 'Investigate within the current shift. Left unresolved, this condition is likely to escalate to a customer-facing incident.',
  },
  Medium: {
    level: 'Medium',
    assessment: 'Monitor closely and investigate as capacity allows. Low urgency, but worth confirming there is no early-stage trend.',
  },
  Low: {
    level: 'Low',
    assessment: 'No immediate action required. Continue routine monitoring.',
  },
  Informational: {
    level: 'Low',
    assessment: 'No action required — logged for audit and trend visibility only.',
  },
}

export const INVESTIGATION_STEPS_POOL: Record<AlertSeverity, string[]> = {
  Critical: [
    'Review the top processes on the affected server for abnormal resource consumption.',
    'Check recent deployments or configuration changes to the affected service.',
    'Confirm whether the condition correlates with a genuine traffic increase or is resource-side.',
    'Escalate to an incident if the metric remains above threshold for another 15 minutes.',
  ],
  High: [
    'Monitor the metric trend over the next few hours.',
    'Review scheduled jobs or batch processes running on the affected server.',
    'Check upstream and downstream dependencies for correlated latency.',
  ],
  Medium: ['Confirm whether the spike has already subsided.', 'Review the affected server for any concurrent maintenance activity.'],
  Low: ['Continue standard monitoring cadence — no action required.'],
  Informational: ['No action required — acknowledge and close out.'],
}

// ---------------------------------------------------------------------------
// Related documentation pool
// ---------------------------------------------------------------------------

export const ALERT_DOC_POOL = [
  { title: 'Runbook: High CPU Utilization Response', type: 'Runbook', description: 'Step-by-step triage for sustained CPU pressure on production servers.' },
  { title: 'Runbook: Memory Pressure Triage', type: 'Runbook', description: 'Diagnosing and resolving memory exhaustion before it affects service availability.' },
  { title: 'Playbook: Disk Capacity Escalation', type: 'Playbook', description: 'Escalation path and cleanup procedures for low disk space alerts.' },
  { title: 'Guide: Database Connection Pool Tuning', type: 'Guide', description: 'Tuning connection pool sizing and timeouts under load.' },
  { title: 'Playbook: Network Latency Investigation', type: 'Playbook', description: 'Isolating latency sources across the network path.' },
  { title: 'Guide: Service Restart Procedures', type: 'Guide', description: 'Safe restart sequencing for production services.' },
  { title: 'Architecture: Production Network Topology', type: 'Reference', description: 'Reference topology and routing for production regions.' },
  { title: 'Runbook: Backup Failure Response', type: 'Runbook', description: 'Recovery steps when a scheduled backup job fails.' },
] as const

// ---------------------------------------------------------------------------
// Related incident title templates
// ---------------------------------------------------------------------------

export const INCIDENT_TITLE_TEMPLATES = ['{alertName} on {host}', '{service} service impact from {alertName}', 'Investigate: {alertName} — {host}'] as const

export const TIMELINE_ACK_OFFSETS = ['5m after trigger', '8m after trigger', '12m after trigger', '18m after trigger'] as const
export const TIMELINE_INCIDENT_OFFSETS = ['15m after trigger', '22m after trigger', '31m after trigger'] as const
export const TIMELINE_RESOLVED_OFFSETS = ['Just now', '10m ago', '35m ago', '1h ago'] as const
