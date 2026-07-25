import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IncidentFilters } from '../components/incidents/IncidentFilters'
import { IncidentPageHeader } from '../components/incidents/IncidentPageHeader'
import { IncidentTable } from '../components/incidents/IncidentTable'
import { CreateIncidentModal } from '../components/incidents/CreateIncidentModal'
import incidentsData, { addIncident } from '../data/incidents'
import type { NewIncidentInput } from '../data/incidents'
import { useIncidentList } from '../hooks/useIncidentList'

interface LocationState {
  prefillServerId?: string
}

function IncidentsPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // Local, refreshable view over the module-level incidentsData array —
  // re-created (new array reference) after a create/update so the list
  // and KPI counts re-render. In production this becomes a data-fetching
  // hook (e.g. useQuery) instead of reading a static import.
  const [incidents, setIncidents] = useState(incidentsData)
  const [createOpen, setCreateOpen] = useState(false)
  const [prefillServerIds, setPrefillServerIds] = useState<string[]>([])

  // Deep-link from a server's "Open Incident" button: arrive here with the
  // server already selected and the Create Incident form open.
  useEffect(() => {
    const state = location.state as LocationState | null
    if (state?.prefillServerId) {
      setPrefillServerIds([state.prefillServerId])
      setCreateOpen(true)
      navigate(location.pathname, { replace: true, state: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  } = useIncidentList(incidents)

  const openCount = useMemo(() => incidents.filter((incident) => incident.status === 'Open').length, [incidents])
  const criticalCount = useMemo(() => incidents.filter((incident) => incident.priority === 'Critical').length, [incidents])

  function handleCreateIncident(input: NewIncidentInput) {
    const created = addIncident(input)
    setIncidents([...incidentsData])
    setCreateOpen(false)
    navigate(`/incidents/${created.id}`)
  }

  function handleCloseCreate() {
    setCreateOpen(false)
    setPrefillServerIds([])
  }

  return (
    <div className="space-y-6 pb-6">
      <IncidentPageHeader
        totalCount={totalCount}
        openCount={openCount}
        criticalCount={criticalCount}
        onCreateClick={() => setCreateOpen(true)}
      />

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

      {createOpen && (
        <CreateIncidentModal onClose={handleCloseCreate} onCreate={handleCreateIncident} initialServerIds={prefillServerIds} />
      )}
    </div>
  )
}

export default IncidentsPage
