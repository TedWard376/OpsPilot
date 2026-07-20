import { Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ServerItem } from '../../data/servers'
import { Pagination } from '../Pagination'
import { ServerRow } from './ServerRow'

interface ServerTableProps {
  servers: ServerItem[]
  totalCount: number
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onRowClick: (server: ServerItem) => void
  filters?: ReactNode
}

const TABLE_HEADERS = [
  'Hostname',
  'Environment',
  'OS',
  'CPU',
  'Memory',
  'Disk',
  'Status',
  'Location',
  'Last seen',
  '',
] as const

// Percentage widths tuned to the longest real value in each column
// (e.g. "staging-file-01", "Development", "Ubuntu 22.04 LTS") plus its
// header label, so nothing needs to truncate at typical desktop widths.
const COLUMN_WIDTHS = ['15%', '11%', '13%', '10%', '10%', '10%', '9%', '8%', '9%', '5%'] as const

export function ServerTable({
  servers,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onRowClick,
  filters,
}: ServerTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      {filters && (
        <div className="border-b border-[var(--border)] px-6 py-4">{filters}</div>
      )}

      <div className="w-full">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            {COLUMN_WIDTHS.map((width, index) => (
              <col key={TABLE_HEADERS[index] || 'actions'} style={{ width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--page-background)]">
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header || 'actions'}
                  scope="col"
                  className="whitespace-nowrap px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {servers.length === 0 ? (
              <tr>
                <td colSpan={TABLE_HEADERS.length} className="px-6 py-12 text-center text-sm text-[var(--muted-foreground)]">
                  No servers match your filters.
                </td>
              </tr>
            ) : (
              servers.map((server) => (
                <ServerRow key={server.id} server={server} onClick={onRowClick} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  )
}

interface ServerPageHeaderProps {
  filteredCount: number
  totalCount: number
}

export function ServerPageHeader({ filteredCount, totalCount }: ServerPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Servers</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {filteredCount} of {totalCount} servers
        </p>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-1.5 self-start rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        <Plus size={16} />
        Add Server
      </button>
    </div>
  )
}