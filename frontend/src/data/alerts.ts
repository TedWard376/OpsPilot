/**
 * Mock alert content — pure content, plus the seed-construction factory
 * (makeAlert) that builds it from real server records. See
 * services/alertService.ts for the access functions (getAllAlerts,
 * getAlertById, getAlertSources).
 */

import { serversData } from './servers'
import type { AlertItem, AlertSeverity, AlertStatus } from '../types/alert'

// Source of truth for the "Filter by source" dropdown.
export const alertSources = ['OpsPilot Monitoring', 'Prometheus', 'Health Check', 'Log Analyzer', 'Network Monitor', 'Backup Service', 'Security Scanner'] as const

function makeAlert(
  id: string,
  name: string,
  severity: AlertSeverity,
  status: AlertStatus,
  source: string,
  serverId: string,
  triggerTime: string,
  triggerTimeISO: string,
  duration: string,
): AlertItem {
  const server = serversData.find((s) => s.id === serverId)
  return {
    id,
    name,
    severity,
    status,
    source,
    affectedServerId: serverId,
    affectedServerHostname: server?.hostname ?? 'unknown',
    environment: server?.environment ?? 'Production',
    triggerTime,
    triggerTimeISO,
    duration,
  }
}

export const alertsData: AlertItem[] = [
  makeAlert('ALRT-3024', 'High CPU Usage', 'Critical', 'Open', 'OpsPilot Monitoring', 'srv-06', 'Jul 18, 2026 10:15', '2026-07-18T10:15:00Z', '25m'),
  makeAlert('ALRT-3023', 'Database Connection Failure', 'Critical', 'Investigating', 'Health Check', 'srv-07', 'Jul 18, 2026 09:48', '2026-07-18T09:48:00Z', '52m'),
  makeAlert('ALRT-3022', 'VM Offline', 'Critical', 'Open', 'Health Check', 'srv-18', 'Jul 18, 2026 10:02', '2026-07-18T10:02:00Z', '38m'),
  makeAlert('ALRT-3021', 'Backup Failed', 'Critical', 'Acknowledged', 'Backup Service', 'srv-14', 'Jul 18, 2026 04:00', '2026-07-18T04:00:00Z', '6h 40m'),
  makeAlert('ALRT-3020', 'Memory Pressure', 'Critical', 'Investigating', 'Prometheus', 'srv-15', 'Jul 18, 2026 07:55', '2026-07-18T07:55:00Z', '2h 45m'),
  makeAlert('ALRT-3019', 'Kubernetes Node NotReady', 'Critical', 'Open', 'OpsPilot Monitoring', 'srv-12', 'Jul 18, 2026 09:55', '2026-07-18T09:55:00Z', '45m'),
  makeAlert('ALRT-3018', 'Unauthorized Access Attempt', 'Critical', 'Investigating', 'Security Scanner', 'srv-10', 'Jul 17, 2026 23:05', '2026-07-17T23:05:00Z', '11h 35m'),
  makeAlert('ALRT-3017', 'Disk Space Low', 'High', 'Open', 'OpsPilot Monitoring', 'srv-14', 'Jul 18, 2026 08:30', '2026-07-18T08:30:00Z', '2h 10m'),
  makeAlert('ALRT-3016', 'Memory Pressure', 'High', 'Acknowledged', 'Prometheus', 'srv-11', 'Jul 18, 2026 06:50', '2026-07-18T06:50:00Z', '3h 50m'),
  makeAlert('ALRT-3015', 'Authentication Errors', 'High', 'Investigating', 'Security Scanner', 'srv-09', 'Jul 17, 2026 18:42', '2026-07-17T18:42:00Z', '16h 13m'),
  makeAlert('ALRT-3014', 'Elevated Error Rate', 'High', 'Open', 'Log Analyzer', 'srv-05', 'Jul 18, 2026 08:05', '2026-07-18T08:05:00Z', '2h 35m'),
  makeAlert('ALRT-3013', 'Backup Failed', 'High', 'Acknowledged', 'Backup Service', 'srv-19', 'Jul 17, 2026 22:15', '2026-07-17T22:15:00Z', '12h 25m'),
  makeAlert('ALRT-3012', 'Disk I/O Saturation', 'High', 'Investigating', 'Prometheus', 'srv-08', 'Jul 18, 2026 05:20', '2026-07-18T05:20:00Z', '5h 20m'),
  makeAlert('ALRT-3011', 'Container Restart Loop', 'High', 'Open', 'OpsPilot Monitoring', 'srv-12', 'Jul 18, 2026 02:10', '2026-07-18T02:10:00Z', '8h 30m'),
  makeAlert('ALRT-3010', 'High CPU Usage', 'Medium', 'Acknowledged', 'Prometheus', 'srv-01', 'Jul 18, 2026 07:00', '2026-07-18T07:00:00Z', '3h 40m'),
  makeAlert('ALRT-3009', 'Disk Space Low', 'Medium', 'Open', 'OpsPilot Monitoring', 'srv-24', 'Jul 18, 2026 06:10', '2026-07-18T06:10:00Z', '4h 30m'),
  makeAlert('ALRT-3008', 'High Network Latency', 'Medium', 'Investigating', 'Network Monitor', 'srv-16', 'Jul 18, 2026 05:15', '2026-07-18T05:15:00Z', '5h 25m'),
  makeAlert('ALRT-3007', 'Authentication Errors', 'Medium', 'Resolved', 'Security Scanner', 'srv-20', 'Jul 16, 2026 14:20', '2026-07-16T14:20:00Z', '1h 45m'),
  makeAlert('ALRT-3006', 'Service Health Check Failed', 'Medium', 'Acknowledged', 'Health Check', 'srv-13', 'Jul 17, 2026 19:30', '2026-07-17T19:30:00Z', '15h 15m'),
  makeAlert('ALRT-3005', 'SSL Certificate Expiring', 'Low', 'Open', 'OpsPilot Monitoring', 'srv-04', 'Jul 17, 2026 20:00', '2026-07-17T20:00:00Z', '14h 55m'),
  makeAlert('ALRT-3004', 'High Network Latency', 'Low', 'Resolved', 'Network Monitor', 'srv-23', 'Jul 16, 2026 09:00', '2026-07-16T09:00:00Z', '3h 30m'),
  makeAlert('ALRT-3003', 'SSL Certificate Expiring', 'Informational', 'Acknowledged', 'OpsPilot Monitoring', 'srv-02', 'Jul 15, 2026 13:20', '2026-07-15T13:20:00Z', '1h 40m'),
  makeAlert('ALRT-3002', 'Low Disk Space', 'Informational', 'Resolved', 'OpsPilot Monitoring', 'srv-25', 'Jul 15, 2026 10:00', '2026-07-15T10:00:00Z', '2h 00m'),
  makeAlert('ALRT-3001', 'Scheduled Maintenance Notice', 'Informational', 'Resolved', 'OpsPilot Monitoring', 'srv-21', 'Jul 14, 2026 22:00', '2026-07-14T22:00:00Z', '3h 00m'),
]
