import type { ServerEnvironment } from './server'

export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational'

export type AlertStatus = 'Open' | 'Acknowledged' | 'Investigating' | 'Resolved'

export interface AlertItem {
  id: string
  name: string
  severity: AlertSeverity
  status: AlertStatus
  source: string
  affectedServerId: string
  affectedServerHostname: string
  environment: ServerEnvironment
  triggerTime: string
  triggerTimeISO: string
  duration: string
}
