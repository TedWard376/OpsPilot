import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { ServerFilters } from '../components/servers/ServerFilters'
import { ServerPageHeader, ServerTable } from '../components/servers/ServerTable'
import serversData from '../data/servers'
import { useServerList } from '../hooks/useServerList'

function ServersPage() {
  const navigate = useNavigate()
  const {
    searchQuery,
    environmentFilter,
    statusFilter,
    sortBy,
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    filteredCount,
    paginatedServers,
    handleSearchChange,
    handleEnvironmentChange,
    handleStatusChange,
    handleSortChange,
    handlePageChange,
  } = useServerList(serversData)

  return (
    <div className="space-y-6 pb-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
        <Link to="/" className="transition-colors hover:text-[var(--foreground)]">
          Dashboard
        </Link>
        <ChevronRight size={14} aria-hidden />
        <Link to="/infrastructure" className="transition-colors hover:text-[var(--foreground)]">
          Infrastructure
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span className="font-medium text-[var(--foreground)]">Servers</span>
      </nav>

      <ServerPageHeader filteredCount={filteredCount} totalCount={totalCount} />

      <ServerTable
        servers={paginatedServers}
        totalCount={filteredCount}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onRowClick={(server) => navigate(`/servers/${server.id}`)}
        filters={
          <ServerFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            environmentFilter={environmentFilter}
            onEnvironmentChange={handleEnvironmentChange}
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        }
      />
    </div>
  )
}

export default ServersPage
