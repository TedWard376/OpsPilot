import { ChevronDown } from 'lucide-react'
import type { ServerEnvironment, ServerStatus } from '../../data/servers'
import { SearchBar } from '../SearchBar'

export type ServerSortOption =
  | 'hostname-asc'
  | 'hostname-desc'
  | 'status'
  | 'cpu-desc'
  | 'memory-desc'
  | 'lastSeen-desc'

interface ServerFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  environmentFilter: ServerEnvironment | 'All'
  onEnvironmentChange: (value: ServerEnvironment | 'All') => void
  statusFilter: ServerStatus | 'All'
  onStatusChange: (value: ServerStatus | 'All') => void
  sortBy: ServerSortOption
  onSortChange: (value: ServerSortOption) => void
}

const selectClassName =
  'appearance-none rounded-lg border border-[var(--border)] bg-[var(--page-background)] py-2 pl-3 pr-8 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20'

function FilterSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  ariaLabel: string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className={selectClassName}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
        aria-hidden
      />
    </div>
  )
}

export function ServerFilters({
  searchQuery,
  onSearchChange,
  environmentFilter,
  onEnvironmentChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
}: ServerFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search servers..."
        ariaLabel="Search servers"
      />

      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          value={environmentFilter}
          onChange={(v) => onEnvironmentChange(v as ServerEnvironment | 'All')}
          ariaLabel="Filter by environment"
          options={[
            { value: 'All', label: 'All' },
            { value: 'Production', label: 'Production' },
            { value: 'Staging', label: 'Staging' },
            { value: 'Development', label: 'Development' },
          ]}
        />

        <FilterSelect
          value={statusFilter}
          onChange={(v) => onStatusChange(v as ServerStatus | 'All')}
          ariaLabel="Filter by status"
          options={[
            { value: 'All', label: 'All' },
            { value: 'Healthy', label: 'Healthy' },
            { value: 'Warning', label: 'Warning' },
            { value: 'Critical', label: 'Critical' },
          ]}
        />

        <FilterSelect
          value={sortBy}
          onChange={(v) => onSortChange(v as ServerSortOption)}
          ariaLabel="Sort servers"
          options={[
            { value: 'hostname-asc', label: 'Hostname A–Z' },
            { value: 'hostname-desc', label: 'Hostname Z–A' },
            { value: 'status', label: 'Status' },
            { value: 'cpu-desc', label: 'CPU (high to low)' },
            { value: 'memory-desc', label: 'Memory (high to low)' },
            { value: 'lastSeen-desc', label: 'Last seen' },
          ]}
        />
      </div>
    </div>
  )
}
