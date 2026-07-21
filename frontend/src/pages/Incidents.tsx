import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { IncidentFilters } from '../components/incidents/IncidentFilters'
import { IncidentPageHeader } from '../components/incidents/IncidentPageHeader'
import { IncidentTable } from '../components/incidents/IncidentTable'
import incidentsData from '../data/incidents'
import { useIncidentList } from '../hooks/useIncidentList'

function IncidentsPage() {
  const navigate = useNavigate()
  const {
    searchQuery,
    statusFilter,
    priorityFilter,
    engineerFilter,
    systemFilter,
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    filteredCount,
    paginatedIncidents,
    handleSearchChange,
    handleStatusChange,
    handlePriorityChange,
    handleEngineerChange,
    handleSystemChange,
    handlePageChange,
  } = useIncidentList(incidentsData)

  const openCount = useMemo(() => incidentsData.filter((incident) => incident.status === 'Open').length, [])
  const criticalCount = useMemo(() => incidentsData.filter((incident) => incident.priority === 'Critical').length, [])

  return (
    <div className="space-y-6 pb-6">
      <IncidentPageHeader totalCount={totalCount} openCount={openCount} criticalCount={criticalCount} />

      <IncidentTable
        incidents={paginatedIncidents}
        totalCount={filteredCount}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onRowClick={(incident) => navigate(`/incidents/${incident.id}`)}
        filters={
          <IncidentFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            priorityFilter={priorityFilter}
            onPriorityChange={handlePriorityChange}
            engineerFilter={engineerFilter}
            onEngineerChange={handleEngineerChange}
            systemFilter={systemFilter}
            onSystemChange={handleSystemChange}
          />
        }
      />
    </div>
  )
}

export default IncidentsPage
