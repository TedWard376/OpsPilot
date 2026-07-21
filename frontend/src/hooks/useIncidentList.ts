import { useMemo, useState } from 'react'
import type { IncidentItem, IncidentPriority, IncidentStatus } from '../data/incidents'

const PAGE_SIZE = 10

function filterIncidents(
  incidents: IncidentItem[],
  searchQuery: string,
  statusFilter: IncidentStatus | 'All',
  priorityFilter: IncidentPriority | 'All',
  engineerFilter: string,
  systemFilter: string,
): IncidentItem[] {
  const query = searchQuery.trim().toLowerCase()

  return incidents.filter((incident) => {
    const matchesSearch =
      query === '' || incident.title.toLowerCase().includes(query) || incident.id.toLowerCase().includes(query)

    const matchesStatus = statusFilter === 'All' || incident.status === statusFilter
    const matchesPriority = priorityFilter === 'All' || incident.priority === priorityFilter
    const matchesEngineer = engineerFilter === 'All' || incident.assignedEngineer === engineerFilter
    const matchesSystem = systemFilter === 'All' || incident.affectedSystems.includes(systemFilter)

    return matchesSearch && matchesStatus && matchesPriority && matchesEngineer && matchesSystem
  })
}

function sortByMostRecent(incidents: IncidentItem[]): IncidentItem[] {
  return [...incidents].sort((a, b) => new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime())
}

export function useIncidentList(allIncidents: IncidentItem[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'All'>('All')
  const [priorityFilter, setPriorityFilter] = useState<IncidentPriority | 'All'>('All')
  const [engineerFilter, setEngineerFilter] = useState('All')
  const [systemFilter, setSystemFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredIncidents = useMemo(
    () => filterIncidents(allIncidents, searchQuery, statusFilter, priorityFilter, engineerFilter, systemFilter),
    [allIncidents, searchQuery, statusFilter, priorityFilter, engineerFilter, systemFilter],
  )

  const sortedIncidents = useMemo(() => sortByMostRecent(filteredIncidents), [filteredIncidents])

  const totalPages = Math.max(1, Math.ceil(sortedIncidents.length / PAGE_SIZE))

  const paginatedIncidents = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages)
    const start = (safePage - 1) * PAGE_SIZE
    return sortedIncidents.slice(start, start + PAGE_SIZE)
  }, [sortedIncidents, currentPage, totalPages])

  function handleSearchChange(value: string) {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  function handleStatusChange(value: IncidentStatus | 'All') {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  function handlePriorityChange(value: IncidentPriority | 'All') {
    setPriorityFilter(value)
    setCurrentPage(1)
  }

  function handleEngineerChange(value: string) {
    setEngineerFilter(value)
    setCurrentPage(1)
  }

  function handleSystemChange(value: string) {
    setSystemFilter(value)
    setCurrentPage(1)
  }

  function handlePageChange(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return {
    searchQuery,
    statusFilter,
    priorityFilter,
    engineerFilter,
    systemFilter,
    currentPage: Math.min(currentPage, totalPages),
    totalPages,
    pageSize: PAGE_SIZE,
    totalCount: allIncidents.length,
    filteredCount: sortedIncidents.length,
    paginatedIncidents,
    handleSearchChange,
    handleStatusChange,
    handlePriorityChange,
    handleEngineerChange,
    handleSystemChange,
    handlePageChange,
  }
}
