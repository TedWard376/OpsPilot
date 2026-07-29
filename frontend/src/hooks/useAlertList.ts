import { useMemo, useState } from 'react'
import type { AlertItem, AlertSeverity, AlertStatus } from '../types/alert'
import type { ServerEnvironment } from '../types/server'

export type AlertSortOption = 'trigger-desc' | 'trigger-asc' | 'severity' | 'duration-desc'

const PAGE_SIZE = 10

const SEVERITY_ORDER: Record<AlertSeverity, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
  Informational: 4,
}

function parseDurationMinutes(duration: string): number {
  const hoursMatch = duration.match(/(\d+)h/)
  const minutesMatch = duration.match(/(\d+)m/)
  const hours = hoursMatch ? Number(hoursMatch[1]) : 0
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0
  return hours * 60 + minutes
}

function sortAlerts(alerts: AlertItem[], sortBy: AlertSortOption): AlertItem[] {
  const sorted = [...alerts]

  switch (sortBy) {
    case 'trigger-asc':
      return sorted.sort((a, b) => new Date(a.triggerTimeISO).getTime() - new Date(b.triggerTimeISO).getTime())
    case 'severity':
      return sorted.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
    case 'duration-desc':
      return sorted.sort((a, b) => parseDurationMinutes(b.duration) - parseDurationMinutes(a.duration))
    case 'trigger-desc':
    default:
      return sorted.sort((a, b) => new Date(b.triggerTimeISO).getTime() - new Date(a.triggerTimeISO).getTime())
  }
}

function filterAlerts(
  alerts: AlertItem[],
  searchQuery: string,
  severityFilter: AlertSeverity | 'All',
  statusFilter: AlertStatus | 'All',
  environmentFilter: ServerEnvironment | 'All',
  sourceFilter: string,
): AlertItem[] {
  const query = searchQuery.trim().toLowerCase()

  return alerts.filter((alert) => {
    const matchesSearch =
      query === '' || alert.name.toLowerCase().includes(query) || alert.id.toLowerCase().includes(query)

    const matchesSeverity = severityFilter === 'All' || alert.severity === severityFilter
    const matchesStatus = statusFilter === 'All' || alert.status === statusFilter
    const matchesEnvironment = environmentFilter === 'All' || alert.environment === environmentFilter
    const matchesSource = sourceFilter === 'All' || alert.source === sourceFilter

    return matchesSearch && matchesSeverity && matchesStatus && matchesEnvironment && matchesSource
  })
}

export function useAlertList(allAlerts: AlertItem[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'All'>('All')
  const [environmentFilter, setEnvironmentFilter] = useState<ServerEnvironment | 'All'>('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [sortBy, setSortBy] = useState<AlertSortOption>('trigger-desc')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredAlerts = useMemo(
    () => filterAlerts(allAlerts, searchQuery, severityFilter, statusFilter, environmentFilter, sourceFilter),
    [allAlerts, searchQuery, severityFilter, statusFilter, environmentFilter, sourceFilter],
  )

  const sortedAlerts = useMemo(() => sortAlerts(filteredAlerts, sortBy), [filteredAlerts, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedAlerts.length / PAGE_SIZE))

  const paginatedAlerts = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages)
    const start = (safePage - 1) * PAGE_SIZE
    return sortedAlerts.slice(start, start + PAGE_SIZE)
  }, [sortedAlerts, currentPage, totalPages])

  function handleSearchChange(value: string) {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  function handleSeverityChange(value: AlertSeverity | 'All') {
    setSeverityFilter(value)
    setCurrentPage(1)
  }

  function handleStatusChange(value: AlertStatus | 'All') {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  function handleEnvironmentChange(value: ServerEnvironment | 'All') {
    setEnvironmentFilter(value)
    setCurrentPage(1)
  }

  function handleSourceChange(value: string) {
    setSourceFilter(value)
    setCurrentPage(1)
  }

  function handleSortChange(value: AlertSortOption) {
    setSortBy(value)
    setCurrentPage(1)
  }

  function handlePageChange(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return {
    searchQuery,
    severityFilter,
    statusFilter,
    environmentFilter,
    sourceFilter,
    sortBy,
    currentPage: Math.min(currentPage, totalPages),
    totalPages,
    pageSize: PAGE_SIZE,
    totalCount: allAlerts.length,
    filteredCount: sortedAlerts.length,
    paginatedAlerts,
    handleSearchChange,
    handleSeverityChange,
    handleStatusChange,
    handleEnvironmentChange,
    handleSourceChange,
    handleSortChange,
    handlePageChange,
  }
}
