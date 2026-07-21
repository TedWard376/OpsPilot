import type { ReactNode } from 'react'
import type { IncidentItem } from '../../data/incidents'
import { Pagination } from '../Pagination'
import { IncidentRow } from './IncidentRow'

interface IncidentTableProps {
  incidents: IncidentItem[]
  totalCount: number
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onRowClick: (incident: IncidentItem) => void
  filters?: ReactNode
}

const TABLE_HEADERS = [
  'ID',
  'Title',
  'Priority',
  'Status',
  'Assigned Engineer',
  'Created Date',
  'Last Updated',
  'Duration',
  'Affected Systems',
] as const

// Percentage widths tuned to the longest real value in each column so
// nothing needs to truncate at typical desktop widths.
const COLUMN_WIDTHS = ['8%', '22%', '9%', '11%', '11%', '11%', '11%', '7%', '10%'] as const

export function IncidentTable({
  incidents,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onRowClick,
  filters,
}: IncidentTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      {filters && <div className="border-b border-[var(--border)] px-6 py-4">{filters}</div>}

      <div className="w-full">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            {COLUMN_WIDTHS.map((width, index) => (
              <col key={TABLE_HEADERS[index]} style={{ width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--page-background)]">
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="whitespace-nowrap px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {incidents.length === 0 ? (
              <tr>
                <td colSpan={TABLE_HEADERS.length} className="px-6 py-12 text-center text-sm text-[var(--muted-foreground)]">
                  No incidents match your filters.
                </td>
              </tr>
            ) : (
              incidents.map((incident) => <IncidentRow key={incident.id} incident={incident} onClick={onRowClick} />)
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
        itemLabel="incidents"
      />
    </div>
  )
}
