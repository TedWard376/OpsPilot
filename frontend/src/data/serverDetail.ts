/**
 * Mock content for the Server Details page — pure content only.
 * See services/serverDetailService.ts for the generator function
 * (getServerDetail) that turns this content into a ServerDetailBundle.
 */

import type { ServerStatus } from '../types/server'
import type { ServerAlertSeverity, ServerAlertStatus, ServerIncidentPriority, ServerIncidentStatus } from '../types/serverDetail'

// ---------------------------------------------------------------------------
// Service stacks per workload type
// ---------------------------------------------------------------------------

export const SERVICE_STACKS: Record<string, { name: string; port: number; baseCpu: number; baseMem: number }[]> = {
  Web: [
    { name: 'nginx', port: 443, baseCpu: 18, baseMem: 22 },
    { name: 'IIS', port: 80, baseCpu: 14, baseMem: 26 },
    { name: 'Docker', port: 2375, baseCpu: 9, baseMem: 15 },
  ],
  API: [
    { name: 'nginx', port: 443, baseCpu: 16, baseMem: 20 },
    { name: 'API Runtime', port: 8080, baseCpu: 24, baseMem: 32 },
    { name: 'Docker', port: 2375, baseCpu: 10, baseMem: 14 },
  ],
  Database: [
    { name: 'PostgreSQL', port: 5432, baseCpu: 34, baseMem: 41 },
    { name: 'SQL Server', port: 1433, baseCpu: 28, baseMem: 38 },
    { name: 'Backup Agent', port: 9553, baseCpu: 6, baseMem: 9 },
  ],
  Cache: [
    { name: 'Redis', port: 6379, baseCpu: 21, baseMem: 44 },
    { name: 'Docker', port: 2375, baseCpu: 8, baseMem: 12 },
  ],
  Auth: [
    { name: 'Authentication Service', port: 8443, baseCpu: 19, baseMem: 24 },
    { name: 'nginx', port: 443, baseCpu: 12, baseMem: 16 },
    { name: 'Docker', port: 2375, baseCpu: 7, baseMem: 11 },
  ],
  'File Storage': [
    { name: 'Samba', port: 445, baseCpu: 11, baseMem: 18 },
    { name: 'Docker', port: 2375, baseCpu: 7, baseMem: 10 },
  ],
  Kubernetes: [
    { name: 'Kubernetes Agent', port: 10250, baseCpu: 22, baseMem: 28 },
    { name: 'kube-proxy', port: 10256, baseCpu: 9, baseMem: 12 },
    { name: 'Docker', port: 2375, baseCpu: 12, baseMem: 16 },
  ],
  Monitoring: [
    { name: 'Prometheus', port: 9090, baseCpu: 26, baseMem: 36 },
    { name: 'Grafana Agent', port: 9091, baseCpu: 11, baseMem: 17 },
    { name: 'Docker', port: 2375, baseCpu: 8, baseMem: 12 },
  ],
  Worker: [
    { name: 'Worker Process', port: 9200, baseCpu: 29, baseMem: 27 },
    { name: 'Docker', port: 2375, baseCpu: 9, baseMem: 13 },
  ],
  'Object Storage': [
    { name: 'MinIO', port: 9000, baseCpu: 17, baseMem: 23 },
    { name: 'Docker', port: 2375, baseCpu: 8, baseMem: 11 },
  ],
}

export const RESTART_WINDOWS = ['2 days ago', '5 days ago', '11 days ago', '18 days ago', '27 days ago', '41 days ago'] as const

// ---------------------------------------------------------------------------
// Alert / incident content pools
// ---------------------------------------------------------------------------

export const ALERT_POOL: Record<ServerStatus, { severity: ServerAlertSeverity; status: ServerAlertStatus; template: string }[]> = {
  Critical: [
    { severity: 'critical', status: 'open', template: 'CPU usage on {host} exceeded 90% threshold' },
    { severity: 'critical', status: 'investigating', template: 'Memory pressure sustained above 85% on {host}' },
    { severity: 'high', status: 'open', template: 'Disk I/O latency spike detected on {host}' },
  ],
  Warning: [
    { severity: 'high', status: 'investigating', template: 'Memory usage trending above 80% on {host}' },
    { severity: 'medium', status: 'open', template: 'Disk usage above 65% threshold on {host}' },
    { severity: 'medium', status: 'acknowledged', template: 'Elevated response latency on {service} service' },
  ],
  Healthy: [
    { severity: 'low', status: 'resolved', template: 'SSL certificate renewal completed on {host}' },
    { severity: 'medium', status: 'acknowledged', template: 'Scheduled maintenance window acknowledged for {host}' },
  ],
}

export const INCIDENT_POOL: Record<ServerStatus, { priority: ServerIncidentPriority; status: ServerIncidentStatus; template: string }[]> = {
  Critical: [
    { priority: 'critical', status: 'investigating', template: '{service} service degradation on {host}' },
    { priority: 'high', status: 'open', template: 'Resource exhaustion risk on {host}' },
  ],
  Warning: [{ priority: 'medium', status: 'investigating', template: 'Intermittent latency reported on {host}' }],
  Healthy: [{ priority: 'low', status: 'resolved', template: 'Planned failover test on {host}' }],
}

export const ASSIGNED_ENGINEERS = ['A. Patel', 'M. Chen', 'R. Gomez', 'L. Brooks', 'S. Novak', 'J. Kim'] as const

// ---------------------------------------------------------------------------
// AI investigation content
// ---------------------------------------------------------------------------

export const DOC_POOL = [
  { title: 'Runbook: High CPU Utilization Response', type: 'Runbook' },
  { title: 'Runbook: Memory Pressure Triage', type: 'Runbook' },
  { title: 'Playbook: Disk Capacity Escalation', type: 'Playbook' },
  { title: 'Guide: Service Restart Procedures', type: 'Guide' },
  { title: 'Architecture: Production Network Topology', type: 'Reference' },
] as const

// ---------------------------------------------------------------------------
// Configuration specs per workload type
// ---------------------------------------------------------------------------

export const SPECS_BY_SERVICE: Record<string, { cores: number; ram: number; storage: number }> = {
  Database: { cores: 16, ram: 64, storage: 1024 },
  Kubernetes: { cores: 8, ram: 32, storage: 512 },
  Cache: { cores: 8, ram: 32, storage: 256 },
  Monitoring: { cores: 8, ram: 32, storage: 512 },
  Worker: { cores: 8, ram: 16, storage: 256 },
  'Object Storage': { cores: 8, ram: 32, storage: 2048 },
  'File Storage': { cores: 4, ram: 16, storage: 2048 },
}
export const DEFAULT_SPEC = { cores: 4, ram: 16, storage: 256 }
