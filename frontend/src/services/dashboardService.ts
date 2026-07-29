/**
 * Dashboard access layer. Each getter maps to one future dashboard
 * endpoint (e.g. `GET /api/dashboard/metrics`, `GET /api/dashboard/health`).
 * Trivial today, but it means Dashboard.tsx never has a direct dependency
 * on the mock data file.
 */

import type { AlertData, HealthDataPoint, IncidentData, MetricData, RecommendationData, SystemStatusData } from '../types/dashboard'
import { alertsData, healthChartData, incidentsData, metricsData, recommendationsData, systemStatusData } from '../data/dashboard'

export function getDashboardMetrics(): MetricData[] {
  return metricsData
}

export function getDashboardHealthChart(): HealthDataPoint[] {
  return healthChartData
}

export function getDashboardAlerts(): AlertData[] {
  return alertsData
}

export function getDashboardIncidents(): IncidentData[] {
  return incidentsData
}

export function getDashboardRecommendations(): RecommendationData[] {
  return recommendationsData
}

export function getDashboardSystemStatus(): SystemStatusData[] {
  return systemStatusData
}
