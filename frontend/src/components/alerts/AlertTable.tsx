import type { ReactNode } from 'react'
import type { AlertItem } from '../../data/alerts'
import { Pagination } from '../Pagination'
import { AlertRow } from './AlertRow'

interface AlertTableProps {
  alerts: AlertItem[]
  totalCount: number
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onRowClick: (alert: AlertItem) => void
  filters?: ReactNode
}

const TABLE_HEADERS = ['Alert ID', 'Alert Name', 'Severity', 'Status', 'Source', 'Affected Server', 'Environment', 'Trigger Time', 'Duration'] as const

// Percentage widths tuned to the longest real value in each column so
// nothing needs to truncate at typical desktop widths.
const COLUMN_WIDTHS = ['8%', '22%', '10%', '10%', '12%', '10%', '9%', '12%', '7%'] as const

export function AlertTable({ alerts, totalCount, currentPage, totalPages, pageSize, onPageChange, onRowClick, filters }: AlertTableProps) {
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
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={TABLE_HEADERS.length} className="px-6 py-12 text-center text-sm text-[var(--muted-foreground)]">
                  No alerts match your filters.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => <AlertRow key={alert.id} alert={alert} onClick={onRowClick} />)
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
        itemLabel="alerts"
      />
    </div>
  )
}
