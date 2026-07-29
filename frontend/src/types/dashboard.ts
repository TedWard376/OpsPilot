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
