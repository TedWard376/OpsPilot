/**
 * Mock incident content — pure content, plus the one factory helper that
 * has to live here rather than in services/incidentService.ts (see note
 * on systemLabelsForServers below).
 * See services/incidentService.ts for the access functions
 * (getAllIncidents, getIncidentById, addIncident, updateIncident).
 */

import { serversData } from './servers'
import type { IncidentItem, IncidentPriority, IncidentStatus } from '../types/incident'

// Source of truth for the "Assign To" dropdown.
export const incidentEngineers = ['A. Patel', 'M. Chen', 'R. Gomez', 'L. Brooks', 'S. Novak', 'J. Kim'] as const

// Canonical, unambiguous label per server `service` type — every incident's
// affectedSystems is derived from this so it always reflects real inventory.
const SERVICE_TO_SYSTEM_LABEL: Record<string, string> = {
  Web: 'Web Tier',
  API: 'API Gateway',
  Database: 'Database Cluster',
  Cache: 'Cache Layer',
  Auth: 'Auth Service',
  'File Storage': 'Storage Pool',
  Kubernetes: 'Kubernetes Cluster',
  Monitoring: 'Monitoring Stack',
  Worker: 'Worker Pool',
  'Object Storage': 'Object Storage',
}

export const incidentAffectedSystems = Array.from(new Set(Object.values(SERVICE_TO_SYSTEM_LABEL))).sort()

/**
 * Derives category labels from a set of real server IDs.
 *
 * This stays in the data file (rather than services/incidentService.ts,
 * where every other incident *function* lives) because the static
 * `incidentsData` seed array below is built with it at module-load time.
 * If it lived in the service file instead, this data file would have to
 * import from the service file, and the service file already imports
 * `incidentsData` from this data file — a circular import. The service
 * layer's `addIncident()` (which needs this same derivation at runtime)
 * imports it from here instead, keeping the dependency one-directional:
 * services/ → data/, never the reverse.
 */
export function systemLabelsForServers(serverIds: string[]): string[] {
  const labels = serverIds
    .map((id) => serversData.find((server) => server.id === id))
    .filter((server): server is NonNullable<typeof server> => Boolean(server))
    .map((server) => SERVICE_TO_SYSTEM_LABEL[server.service] ?? server.service)
  return Array.from(new Set(labels))
}

function makeIncident(
  id: string,
  title: string,
  priority: IncidentPriority,
  status: IncidentStatus,
  assignedEngineer: string,
  createdAt: string,
  createdAtISO: string,
  updatedAt: string,
  duration: string,
  affectedServerIds: string[],
): IncidentItem {
  return {
    id,
    title,
    priority,
    status,
    assignedEngineer,
    createdAt,
    createdAtISO,
    updatedAt,
    duration,
    affectedServerIds,
    affectedSystems: systemLabelsForServers(affectedServerIds),
  }
}

export const incidentsData: IncidentItem[] = [
  makeIncident('INC-2041', 'Database Performance Degradation', 'Critical', 'Investigating', 'A. Patel', 'Jul 18, 2026 09:12', '2026-07-18T09:12:00Z', 'Jul 18, 2026 10:40', '1h 28m', ['srv-06', 'srv-04']),
  makeIncident('INC-2040', 'API Gateway Intermittent Failures', 'Critical', 'Open', 'M. Chen', 'Jul 18, 2026 08:05', '2026-07-18T08:05:00Z', 'Jul 18, 2026 10:35', '2h 30m', ['srv-04', 'srv-05']),
  makeIncident('INC-2039', 'Cache Cluster Node Failure', 'High', 'Investigating', 'R. Gomez', 'Jul 18, 2026 06:50', '2026-07-18T06:50:00Z', 'Jul 18, 2026 10:20', '3h 30m', ['srv-11']),
  makeIncident('INC-2038', 'Storage Replication Lag', 'Medium', 'Monitoring', 'L. Brooks', 'Jul 17, 2026 22:15', '2026-07-17T22:15:00Z', 'Jul 18, 2026 09:00', '10h 45m', ['srv-14']),
  makeIncident('INC-2037', 'SSL Certificate Expiring Soon', 'Low', 'Open', 'S. Novak', 'Jul 17, 2026 20:00', '2026-07-17T20:00:00Z', 'Jul 17, 2026 20:00', '14h 55m', ['srv-04']),
  makeIncident('INC-2036', 'Elevated Memory Usage on Auth Service', 'High', 'Investigating', 'J. Kim', 'Jul 17, 2026 18:42', '2026-07-17T18:42:00Z', 'Jul 18, 2026 07:10', '16h 13m', ['srv-09']),
  makeIncident('INC-2035', 'Kubernetes Node NotReady', 'Critical', 'Open', 'A. Patel', 'Jul 18, 2026 09:55', '2026-07-18T09:55:00Z', 'Jul 18, 2026 10:42', '47m', ['srv-12']),
  makeIncident('INC-2034', 'Disk Space Critical on Backup Server', 'Critical', 'Investigating', 'M. Chen', 'Jul 18, 2026 07:30', '2026-07-18T07:30:00Z', 'Jul 18, 2026 10:15', '2h 45m', ['srv-14']),
  makeIncident('INC-2033', 'DNS Resolution Failures', 'High', 'Resolved', 'R. Gomez', 'Jul 16, 2026 14:20', '2026-07-16T14:20:00Z', 'Jul 16, 2026 16:05', '1h 45m', ['srv-01', 'srv-04']),
  makeIncident('INC-2032', 'Load Balancer Health Check Flapping', 'Medium', 'Monitoring', 'L. Brooks', 'Jul 17, 2026 11:10', '2026-07-17T11:10:00Z', 'Jul 18, 2026 08:30', '21h 20m', ['srv-01', 'srv-02', 'srv-03']),
  makeIncident('INC-2031', 'Backup Job Failure', 'Medium', 'Open', 'S. Novak', 'Jul 18, 2026 04:00', '2026-07-18T04:00:00Z', 'Jul 18, 2026 04:00', '6h 40m', ['srv-14']),
  makeIncident('INC-2030', 'Network Latency Spike — West EU', 'High', 'Investigating', 'J. Kim', 'Jul 18, 2026 05:15', '2026-07-18T05:15:00Z', 'Jul 18, 2026 09:50', '5h 25m', ['srv-16', 'srv-17']),
  makeIncident('INC-2029', 'Unauthorized Access Attempt Detected', 'Critical', 'Investigating', 'A. Patel', 'Jul 17, 2026 23:05', '2026-07-17T23:05:00Z', 'Jul 18, 2026 08:00', '11h 35m', ['srv-09', 'srv-10']),
  makeIncident('INC-2028', 'Worker Queue Backlog Growing', 'Medium', 'Monitoring', 'M. Chen', 'Jul 17, 2026 19:30', '2026-07-17T19:30:00Z', 'Jul 18, 2026 06:45', '15h 15m', ['srv-15']),
  makeIncident('INC-2027', 'TLS Handshake Errors on API Gateway', 'High', 'Resolved', 'R. Gomez', 'Jul 16, 2026 09:00', '2026-07-16T09:00:00Z', 'Jul 16, 2026 12:30', '3h 30m', ['srv-04']),
  makeIncident('INC-2026', 'Container Restart Loop — Worker Pool', 'High', 'Investigating', 'L. Brooks', 'Jul 18, 2026 02:10', '2026-07-18T02:10:00Z', 'Jul 18, 2026 09:15', '8h 05m', ['srv-12']),
  makeIncident('INC-2025', 'Object Storage Throttling', 'Low', 'Monitoring', 'S. Novak', 'Jul 17, 2026 16:00', '2026-07-17T16:00:00Z', 'Jul 18, 2026 05:00', '18h 00m', ['srv-14']),
  makeIncident('INC-2024', 'Monitoring Agent Disconnected', 'Low', 'Closed', 'J. Kim', 'Jul 15, 2026 10:00', '2026-07-15T10:00:00Z', 'Jul 15, 2026 12:00', '2h 00m', ['srv-13']),
  makeIncident('INC-2023', 'Scheduled Maintenance — Cache Layer', 'Low', 'Closed', 'A. Patel', 'Jul 14, 2026 22:00', '2026-07-14T22:00:00Z', 'Jul 15, 2026 01:00', '3h 00m', ['srv-11']),
  makeIncident('INC-2022', 'File Storage Latency Spike', 'Medium', 'Resolved', 'M. Chen', 'Jul 15, 2026 13:20', '2026-07-15T13:20:00Z', 'Jul 15, 2026 15:00', '1h 40m', ['srv-08']),
]
