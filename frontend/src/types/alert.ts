import type { ServerEnvironment } from './server'

export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational'

export type AlertStatus = 'Open' | 'Acknowledged' | 'Investigating' | 'Resolved'

export interface AlertItem {
  id: string
  name: string
  /** Long-form description of what triggered the alert. From the backend's `description` field. */
  description: string
  severity: AlertSeverity
  status: AlertStatus
  source: string
  affectedServerId: string
  affectedServerHostname: string
  /** Alert category, e.g. "Compute", "Storage", "Network". From the backend's `category` field. */
  category: string
  environment: ServerEnvironment
  triggerTime: string
  triggerTimeISO: string
  duration: string
  /** Whether an engineer has acknowledged this alert. From the backend's `acknowledged` field. */
  acknowledged: boolean
  /** Name of the engineer who acknowledged this alert, if any. From the backend's `acknowledgedBy` field. */
  acknowledgedBy: string | null
}
