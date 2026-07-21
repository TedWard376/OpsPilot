/**
 * Mock data for Incident Management.
 * In production this file's exports are replaced by FastAPI calls
 * (e.g. `GET /api/incidents`, `GET /api/incidents/{id}`), while every
 * component keeps consuming the same `IncidentItem` shape.
 */

export type IncidentPriority = 'Critical' | 'High' | 'Medium' | 'Low'

export type IncidentStatus = 'Open' | 'Investigating' | 'Monitoring' | 'Resolved' | 'Closed'

export interface IncidentItem {
  id: string
  title: string
  priority: IncidentPriority
  status: IncidentStatus
  assignedEngineer: string
  createdAt: string
  /** ISO timestamp for sorting — API will provide this in production */
  createdAtISO: string
  updatedAt: string
  duration: string
  affectedSystems: string[]
}

// Source of truth for filter dropdown options — derived from the same
// pool used to author the mock incidents below, so filters never fall
// out of sync with the data.
export const incidentEngineers = ['A. Patel', 'M. Chen', 'R. Gomez', 'L. Brooks', 'S. Novak', 'J. Kim'] as const

export const incidentAffectedSystems = [
  'API Gateway',
  'Database Cluster',
  'Cache Layer',
  'Message Queue',
  'Auth Service',
  'Object Storage',
  'Load Balancer',
  'Storage Pool',
  'Kubernetes Cluster',
  'DNS Service',
  'Network',
] as const

export const incidentsData: IncidentItem[] = [
  {
    id: 'INC-2041',
    title: 'Database Performance Degradation',
    priority: 'Critical',
    status: 'Investigating',
    assignedEngineer: 'A. Patel',
    createdAt: 'Jul 18, 2026 09:12',
    createdAtISO: '2026-07-18T09:12:00Z',
    updatedAt: 'Jul 18, 2026 10:40',
    duration: '1h 28m',
    affectedSystems: ['Database Cluster', 'API Gateway'],
  },
  {
    id: 'INC-2040',
    title: 'API Gateway Intermittent Failures',
    priority: 'Critical',
    status: 'Open',
    assignedEngineer: 'M. Chen',
    createdAt: 'Jul 18, 2026 08:05',
    createdAtISO: '2026-07-18T08:05:00Z',
    updatedAt: 'Jul 18, 2026 10:35',
    duration: '2h 30m',
    affectedSystems: ['API Gateway'],
  },
  {
    id: 'INC-2039',
    title: 'Cache Cluster Node Failure',
    priority: 'High',
    status: 'Investigating',
    assignedEngineer: 'R. Gomez',
    createdAt: 'Jul 18, 2026 06:50',
    createdAtISO: '2026-07-18T06:50:00Z',
    updatedAt: 'Jul 18, 2026 10:20',
    duration: '3h 30m',
    affectedSystems: ['Cache Layer'],
  },
  {
    id: 'INC-2038',
    title: 'Storage Replication Lag',
    priority: 'Medium',
    status: 'Monitoring',
    assignedEngineer: 'L. Brooks',
    createdAt: 'Jul 17, 2026 22:15',
    createdAtISO: '2026-07-17T22:15:00Z',
    updatedAt: 'Jul 18, 2026 09:00',
    duration: '10h 45m',
    affectedSystems: ['Storage Pool'],
  },
  {
    id: 'INC-2037',
    title: 'SSL Certificate Expiring Soon',
    priority: 'Low',
    status: 'Open',
    assignedEngineer: 'S. Novak',
    createdAt: 'Jul 17, 2026 20:00',
    createdAtISO: '2026-07-17T20:00:00Z',
    updatedAt: 'Jul 17, 2026 20:00',
    duration: '14h 55m',
    affectedSystems: ['API Gateway'],
  },
  {
    id: 'INC-2036',
    title: 'Elevated Memory Usage on Auth Service',
    priority: 'High',
    status: 'Investigating',
    assignedEngineer: 'J. Kim',
    createdAt: 'Jul 17, 2026 18:42',
    createdAtISO: '2026-07-17T18:42:00Z',
    updatedAt: 'Jul 18, 2026 07:10',
    duration: '16h 13m',
    affectedSystems: ['Auth Service'],
  },
  {
    id: 'INC-2035',
    title: 'Kubernetes Node NotReady',
    priority: 'Critical',
    status: 'Open',
    assignedEngineer: 'A. Patel',
    createdAt: 'Jul 18, 2026 09:55',
    createdAtISO: '2026-07-18T09:55:00Z',
    updatedAt: 'Jul 18, 2026 10:42',
    duration: '47m',
    affectedSystems: ['Kubernetes Cluster'],
  },
  {
    id: 'INC-2034',
    title: 'Disk Space Critical on Backup Server',
    priority: 'Critical',
    status: 'Investigating',
    assignedEngineer: 'M. Chen',
    createdAt: 'Jul 18, 2026 07:30',
    createdAtISO: '2026-07-18T07:30:00Z',
    updatedAt: 'Jul 18, 2026 10:15',
    duration: '2h 45m',
    affectedSystems: ['Storage Pool'],
  },
  {
    id: 'INC-2033',
    title: 'DNS Resolution Failures',
    priority: 'High',
    status: 'Resolved',
    assignedEngineer: 'R. Gomez',
    createdAt: 'Jul 16, 2026 14:20',
    createdAtISO: '2026-07-16T14:20:00Z',
    updatedAt: 'Jul 16, 2026 16:05',
    duration: '1h 45m',
    affectedSystems: ['DNS Service'],
  },
  {
    id: 'INC-2032',
    title: 'Load Balancer Health Check Flapping',
    priority: 'Medium',
    status: 'Monitoring',
    assignedEngineer: 'L. Brooks',
    createdAt: 'Jul 17, 2026 11:10',
    createdAtISO: '2026-07-17T11:10:00Z',
    updatedAt: 'Jul 18, 2026 08:30',
    duration: '21h 20m',
    affectedSystems: ['Load Balancer'],
  },
  {
    id: 'INC-2031',
    title: 'Backup Job Failure',
    priority: 'Medium',
    status: 'Open',
    assignedEngineer: 'S. Novak',
    createdAt: 'Jul 18, 2026 04:00',
    createdAtISO: '2026-07-18T04:00:00Z',
    updatedAt: 'Jul 18, 2026 04:00',
    duration: '6h 40m',
    affectedSystems: ['Storage Pool'],
  },
  {
    id: 'INC-2030',
    title: 'Network Latency Spike — West EU',
    priority: 'High',
    status: 'Investigating',
    assignedEngineer: 'J. Kim',
    createdAt: 'Jul 18, 2026 05:15',
    createdAtISO: '2026-07-18T05:15:00Z',
    updatedAt: 'Jul 18, 2026 09:50',
    duration: '5h 25m',
    affectedSystems: ['Network'],
  },
  {
    id: 'INC-2029',
    title: 'Unauthorized Access Attempt Detected',
    priority: 'Critical',
    status: 'Investigating',
    assignedEngineer: 'A. Patel',
    createdAt: 'Jul 17, 2026 23:05',
    createdAtISO: '2026-07-17T23:05:00Z',
    updatedAt: 'Jul 18, 2026 08:00',
    duration: '11h 35m',
    affectedSystems: ['Auth Service'],
  },
  {
    id: 'INC-2028',
    title: 'Message Queue Backlog Growing',
    priority: 'Medium',
    status: 'Monitoring',
    assignedEngineer: 'M. Chen',
    createdAt: 'Jul 17, 2026 19:30',
    createdAtISO: '2026-07-17T19:30:00Z',
    updatedAt: 'Jul 18, 2026 06:45',
    duration: '15h 15m',
    affectedSystems: ['Message Queue'],
  },
  {
    id: 'INC-2027',
    title: 'TLS Handshake Errors on API Gateway',
    priority: 'High',
    status: 'Resolved',
    assignedEngineer: 'R. Gomez',
    createdAt: 'Jul 16, 2026 09:00',
    createdAtISO: '2026-07-16T09:00:00Z',
    updatedAt: 'Jul 16, 2026 12:30',
    duration: '3h 30m',
    affectedSystems: ['API Gateway'],
  },
  {
    id: 'INC-2026',
    title: 'Container Restart Loop — Worker Pool',
    priority: 'High',
    status: 'Investigating',
    assignedEngineer: 'L. Brooks',
    createdAt: 'Jul 18, 2026 02:10',
    createdAtISO: '2026-07-18T02:10:00Z',
    updatedAt: 'Jul 18, 2026 09:15',
    duration: '8h 05m',
    affectedSystems: ['Kubernetes Cluster'],
  },
  {
    id: 'INC-2025',
    title: 'Object Storage Throttling',
    priority: 'Low',
    status: 'Monitoring',
    assignedEngineer: 'S. Novak',
    createdAt: 'Jul 17, 2026 16:00',
    createdAtISO: '2026-07-17T16:00:00Z',
    updatedAt: 'Jul 18, 2026 05:00',
    duration: '18h 00m',
    affectedSystems: ['Object Storage'],
  },
  {
    id: 'INC-2024',
    title: 'Monitoring Agent Disconnected',
    priority: 'Low',
    status: 'Closed',
    assignedEngineer: 'J. Kim',
    createdAt: 'Jul 15, 2026 10:00',
    createdAtISO: '2026-07-15T10:00:00Z',
    updatedAt: 'Jul 15, 2026 12:00',
    duration: '2h 00m',
    affectedSystems: ['Database Cluster'],
  },
  {
    id: 'INC-2023',
    title: 'Scheduled Maintenance — Cache Layer',
    priority: 'Low',
    status: 'Closed',
    assignedEngineer: 'A. Patel',
    createdAt: 'Jul 14, 2026 22:00',
    createdAtISO: '2026-07-14T22:00:00Z',
    updatedAt: 'Jul 15, 2026 01:00',
    duration: '3h 00m',
    affectedSystems: ['Cache Layer'],
  },
  {
    id: 'INC-2022',
    title: 'File Storage Latency Spike',
    priority: 'Medium',
    status: 'Resolved',
    assignedEngineer: 'M. Chen',
    createdAt: 'Jul 15, 2026 13:20',
    createdAtISO: '2026-07-15T13:20:00Z',
    updatedAt: 'Jul 15, 2026 15:00',
    duration: '1h 40m',
    affectedSystems: ['Storage Pool'],
  },
]

export function getIncidentById(id: string): IncidentItem | undefined {
  return incidentsData.find((incident) => incident.id === id)
}

export default incidentsData
