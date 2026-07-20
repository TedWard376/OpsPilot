import { useMemo, useState } from 'react'
import type { ServerItem, ServerEnvironment, ServerStatus } from '../data/servers'
import type { ServerSortOption } from '../components/servers/ServerFilters'

const STATUS_ORDER: Record<ServerStatus, number> = {
  Critical: 0,
  Warning: 1,
  Healthy: 2,
}

const PAGE_SIZE = 10

function sortServers(servers: ServerItem[], sortBy: ServerSortOption): ServerItem[] {
  const sorted = [...servers]

  switch (sortBy) {
    case 'hostname-asc':
      return sorted.sort((a, b) => a.hostname.localeCompare(b.hostname))
    case 'hostname-desc':
      return sorted.sort((a, b) => b.hostname.localeCompare(a.hostname))
    case 'status':
      return sorted.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
    case 'cpu-desc':
      return sorted.sort((a, b) => b.cpu - a.cpu)
    case 'memory-desc':
      return sorted.sort((a, b) => b.memory - a.memory)
    case 'lastSeen-desc':
      return sorted.sort(
        (a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime(),
      )
    default:
      return sorted
  }
}

function filterServers(
  servers: ServerItem[],
  searchQuery: string,
  environmentFilter: ServerEnvironment | 'All',
  statusFilter: ServerStatus | 'All',
): ServerItem[] {
  const query = searchQuery.trim().toLowerCase()

  return servers.filter((server) => {
    const matchesSearch =
      query === '' ||
      server.hostname.toLowerCase().includes(query) ||
      server.os.toLowerCase().includes(query) ||
      server.location.toLowerCase().includes(query) ||
      server.service.toLowerCase().includes(query)

    const matchesEnvironment =
      environmentFilter === 'All' || server.environment === environmentFilter

    const matchesStatus = statusFilter === 'All' || server.status === statusFilter

    return matchesSearch && matchesEnvironment && matchesStatus
  })
}

export function useServerList(allServers: ServerItem[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [environmentFilter, setEnvironmentFilter] = useState<ServerEnvironment | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<ServerStatus | 'All'>('All')
  const [sortBy, setSortBy] = useState<ServerSortOption>('hostname-asc')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredServers = useMemo(
    () => filterServers(allServers, searchQuery, environmentFilter, statusFilter),
    [allServers, searchQuery, environmentFilter, statusFilter],
  )

  const sortedServers = useMemo(
    () => sortServers(filteredServers, sortBy),
    [filteredServers, sortBy],
  )

  const totalPages = Math.max(1, Math.ceil(sortedServers.length / PAGE_SIZE))

  const paginatedServers = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages)
    const start = (safePage - 1) * PAGE_SIZE
    return sortedServers.slice(start, start + PAGE_SIZE)
  }, [sortedServers, currentPage, totalPages])

  function handleSearchChange(value: string) {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  function handleEnvironmentChange(value: ServerEnvironment | 'All') {
    setEnvironmentFilter(value)
    setCurrentPage(1)
  }

  function handleStatusChange(value: ServerStatus | 'All') {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  function handleSortChange(value: ServerSortOption) {
    setSortBy(value)
    setCurrentPage(1)
  }

  function handlePageChange(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return {
    searchQuery,
    environmentFilter,
    statusFilter,
    sortBy,
    currentPage: Math.min(currentPage, totalPages),
    totalPages,
    pageSize: PAGE_SIZE,
    totalCount: allServers.length,
    filteredCount: sortedServers.length,
    paginatedServers,
    handleSearchChange,
    handleEnvironmentChange,
    handleStatusChange,
    handleSortChange,
    handlePageChange,
  }
}
