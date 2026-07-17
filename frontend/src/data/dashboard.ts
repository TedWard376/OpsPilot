/**
 * Mock data for the Dashboard page
 * In production, this would be replaced with API calls
 */

export interface MetricData {
  label: string
  value: string | number
  icon: 'heart' | 'server' | 'alert' | 'warning' | 'zap' | 'shield'
  trend?: number
  status: 'healthy' | 'warning' | 'critical'
}

export interface HealthDataPoint {
  time: string
  value: number
}

export interface AlertData {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  resource: string
  timestamp: string
  investigation: 'open' | 'investigating' | 'acknowledged' | 'resolved'
}

export interface IncidentData {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium'
  status: 'open' | 'investigating' | 'resolved'
  engineer: string
  affectedSystems: number
  startTime: string
  duration?: string
}

export interface RecommendationData {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: 'optimization' | 'security' | 'reliability'
}

export interface SystemStatusData {
  name: string
  status: 'operational' | 'degraded' | 'down'
  uptime: number
  latency: string
}

// KPI Metrics
export const metricsData: MetricData[] = [
  {
    label: 'Infrastructure Health',
    value: '94%',
    icon: 'heart',
    trend: 2,
    status: 'healthy',
  },
  {
    label: 'Servers Online',
    value: '47/52',
    icon: 'server',
    trend: -2,
    status: 'warning',
  },
  {
    label: 'Critical Alerts',
    value: 3,
    icon: 'alert',
    trend: 1,
    status: 'critical',
  },
  {
    label: 'Open Incidents',
    value: 4,
    icon: 'warning',
    trend: 0,
    status: 'warning',
  },
  {
    label: "Today's Investigations",
    value: 7,
    icon: 'zap',
    trend: 3,
    status: 'healthy',
  },
  {
    label: 'Backup Success Rate',
    value: '98.4%',
    icon: 'shield',
    trend: 142,
    status: 'healthy',
  },
]

// Infrastructure Health Chart Data (24-hour trend)
export const healthChartData: HealthDataPoint[] = [
  { time: '00:00', value: 85 },
  { time: '02:00', value: 88 },
  { time: '04:00', value: 92 },
  { time: '06:00', value: 95 },
  { time: '08:00', value: 82 },
  { time: '10:00', value: 78 },
  { time: '12:00', value: 85 },
  { time: '14:00', value: 88 },
  { time: '16:00', value: 92 },
  { time: '18:00', value: 90 },
  { time: '20:00', value: 87 },
  { time: '22:00', value: 80 },
]

// Recent Critical Alerts
export const alertsData: AlertData[] = [
  {
    id: 'alert-1',
    severity: 'critical',
    title: 'Database CPU exceeds 90% threshold',
    resource: 'prod-db-01',
    timestamp: '14 mins ago',
    investigation: 'open',
  },
  {
    id: 'alert-2',
    severity: 'high',
    title: 'Memory pressure detected on cache node',
    resource: 'prod-cache-01',
    timestamp: '28 mins ago',
    investigation: 'investigating',
  },
  {
    id: 'alert-3',
    severity: 'high',
    title: 'Disk usage above 85% on backup server',
    resource: 'prod-backup-01',
    timestamp: '1h 12m ago',
    investigation: 'open',
  },
  {
    id: 'alert-4',
    severity: 'medium',
    title: 'SSL certificate expiring in 14 days',
    resource: 'prod-web-01',
    timestamp: '3h ago',
    investigation: 'acknowledged',
  },
  {
    id: 'alert-5',
    severity: 'medium',
    title: 'Failed login attempts: 47 in last hour',
    resource: 'prod-auth-01',
    timestamp: '4h 22m ago',
    investigation: 'open',
  },
]

// Recent Incidents
export const incidentsData: IncidentData[] = [
  {
    id: 'inc-1',
    title: 'Database Performance Degradation',
    severity: 'critical',
    status: 'investigating',
    engineer: 'A. Patel',
    affectedSystems: 8,
    startTime: '2 hours ago',
    duration: '1h 42m',
  },
  {
    id: 'inc-2',
    title: 'API Gateway Intermittent Failures',
    severity: 'critical',
    status: 'open',
    engineer: 'M. Chen',
    affectedSystems: 5,
    startTime: '45 minutes ago',
    duration: '2h 10m',
  },
  {
    id: 'inc-3',
    title: 'Cache Cluster Node Failure',
    severity: 'high',
    status: 'investigating',
    engineer: 'R. Gomez',
    affectedSystems: 3,
    startTime: '3 hours ago',
    duration: '4h 33m',
  },
  {
    id: 'inc-4',
    title: 'Storage Replication Lag',
    severity: 'medium',
    status: 'resolved',
    engineer: 'L. Brooks',
    affectedSystems: 2,
    startTime: '6 hours ago',
    duration: '28m',
  },
]

// AI Recommendations
export const recommendationsData: RecommendationData[] = [
  {
    id: 'rec-1',
    title: 'Scale API servers horizontally',
    description: 'Current load is approaching 85% capacity. Recommend adding 3 additional instances to handle peak traffic.',
    impact: 'high',
    category: 'optimization',
  },
  {
    id: 'rec-2',
    title: 'Enable automatic failover',
    description: 'Database replica lag detected. Enable automatic failover to ensure higher availability.',
    impact: 'high',
    category: 'reliability',
  },
  {
    id: 'rec-3',
    title: 'Review security group rules',
    description: 'Detected overly permissive ingress rules on 3 security groups. Review and restrict access.',
    impact: 'high',
    category: 'security',
  },
]

// System Status Overview
export const systemStatusData: SystemStatusData[] = [
  { name: 'API Gateway', status: 'operational', uptime: 99.95, latency: '28ms' },
  { name: 'Database Cluster', status: 'degraded', uptime: 99.87, latency: '842ms' },
  { name: 'Cache Layer', status: 'operational', uptime: 99.98, latency: '14ms' },
  { name: 'Message Queue', status: 'operational', uptime: 99.92, latency: '12ms' },
  { name: 'Auth Service', status: 'operational', uptime: 99.89, latency: '34ms' },
  { name: 'Object Storage', status: 'operational', uptime: 99.99, latency: '67ms' },
]
