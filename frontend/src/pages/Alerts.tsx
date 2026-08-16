import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertFilters } from '../components/alerts/AlertFilters'
import { AlertsPageHeader } from '../components/alerts/AlertsPageHeader'
import { AlertTable } from '../components/alerts/AlertTable'
import { getAllAlerts, loadAlertCache } from '../services/alertService'
import { useAlertList } from '../hooks/useAlertList'
import type { AlertItem } from '../types/alert'

function AlertsPage() {
  const navigate = useNavigate()
  const [alertsData, setAlertsData] = useState<AlertItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadAlerts() {
      try {
        setIsLoading(true)
        await loadAlertCache(true)

        if (!cancelled) {
          setAlertsData(getAllAlerts())
          setError(null)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load alerts.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadAlerts()

    return () => {
      cancelled = true
    }
  }, [])

  const {
    searchQuery,
    severityFilter,
    statusFilter,
    environmentFilter,
    sourceFilter,
    sortBy,
    currentPage,
    totalPages,
    pageSize,
    filteredCount,
    paginatedAlerts,
    handleSearchChange,
    handleSeverityChange,
    handleStatusChange,
    handleEnvironmentChange,
    handleSourceChange,
    handleSortChange,
    handlePageChange,
  } = useAlertList(alertsData)

  const activeAlerts = useMemo(() => alertsData.filter((alert) => alert.status !== 'Resolved'), [alertsData])
  const totalActiveCount = activeAlerts.length
  const criticalCount = useMemo(() => activeAlerts.filter((alert) => alert.severity === 'Critical').length, [activeAlerts])
  const warningCount = useMemo(
    () => activeAlerts.filter((alert) => alert.severity === 'High' || alert.severity === 'Medium').length,
    [activeAlerts],
  )
  const acknowledgedCount = useMemo(() => alertsData.filter((alert) => alert.status === 'Acknowledged').length, [alertsData])

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">
        Loading alerts…
      </div>
    )
  }

  if (error) {
    return <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">{error}</div>
  }

  return (
    <div className="space-y-6 pb-6">
      <AlertsPageHeader
        totalActiveCount={totalActiveCount}
        criticalCount={criticalCount}
        warningCount={warningCount}
        acknowledgedCount={acknowledgedCount}
      />

      <AlertTable
        alerts={paginatedAlerts}
        totalCount={filteredCount}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onRowClick={(alert) => navigate(`/alerts/${alert.id}`)}
        filters={
          <AlertFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            severityFilter={severityFilter}
            onSeverityChange={handleSeverityChange}
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            environmentFilter={environmentFilter}
            onEnvironmentChange={handleEnvironmentChange}
            sourceFilter={sourceFilter}
            onSourceChange={handleSourceChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        }
      />
    </div>
  )
}

export default AlertsPage
