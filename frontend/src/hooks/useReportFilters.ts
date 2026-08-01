import { useState } from 'react'
import type { IncidentCategory, ReportEnvironment, ReportFilters, ReportSeverity } from '../types/reports'

const DEFAULT_FILTERS: ReportFilters = {
  dateRange: '6m',
  severity: 'All',
  environment: 'All',
  category: 'All',
}

export function useReportFilters() {
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_FILTERS)

  function setDateRange(dateRange: ReportFilters['dateRange']) {
    setFilters((prev) => ({ ...prev, dateRange }))
  }

  function setSeverity(severity: ReportSeverity | 'All') {
    setFilters((prev) => ({ ...prev, severity }))
  }

  function setEnvironment(environment: ReportEnvironment | 'All') {
    setFilters((prev) => ({ ...prev, environment }))
  }

  function setCategory(category: IncidentCategory | 'All') {
    setFilters((prev) => ({ ...prev, category }))
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  const isFiltered = filters.severity !== 'All' || filters.environment !== 'All' || filters.category !== 'All' || filters.dateRange !== DEFAULT_FILTERS.dateRange

  return { filters, setDateRange, setSeverity, setEnvironment, setCategory, resetFilters, isFiltered }
}
