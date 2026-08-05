import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { ServerFilters } from '../components/servers/ServerFilters'
import { ServerPageHeader, ServerTable } from '../components/servers/ServerTable'
import { getAllServers, loadServerCache } from '../services/serverService'
import { useServerList } from '../hooks/useServerList'
import type { ServerItem } from '../types/server'

function ServersPage() {
  const navigate = useNavigate()
  const [allServers, setAllServers] = useState<ServerItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadServers() {
      try {
        setIsLoading(true)
        await loadServerCache(true)

        if (!cancelled) {
          setAllServers(getAllServers())
          setError(null)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load servers.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadServers()

    return () => {
      cancelled = true
    }
  }, [])

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
  } = useServerList(allServers)

  if (isLoading) {
    return <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">Loading servers…</div>
  }

  if (error) {
    return <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">{error}</div>
  }

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
