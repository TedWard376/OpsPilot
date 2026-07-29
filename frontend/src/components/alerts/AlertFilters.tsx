import { ChevronDown } from 'lucide-react'
import type { AlertSeverity, AlertStatus } from '../../types/alert'
import { getAlertSources } from '../../services/alertService'
import type { ServerEnvironment } from '../../types/server'
import type { AlertSortOption } from '../../hooks/useAlertList'
import { AlertSearch } from './AlertSearch'

interface AlertFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  severityFilter: AlertSeverity | 'All'
  onSeverityChange: (value: AlertSeverity | 'All') => void
  statusFilter: AlertStatus | 'All'
  onStatusChange: (value: AlertStatus | 'All') => void
  environmentFilter: ServerEnvironment | 'All'
  onEnvironmentChange: (value: ServerEnvironment | 'All') => void
  sourceFilter: string
  onSourceChange: (value: string) => void
  sortBy: AlertSortOption
  onSortChange: (value: AlertSortOption) => void
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
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={ariaLabel} className={selectClassName}>
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

export function AlertFilters({
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  statusFilter,
  onStatusChange,
  environmentFilter,
  onEnvironmentChange,
  sourceFilter,
  onSourceChange,
  sortBy,
  onSortChange,
}: AlertFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <AlertSearch value={searchQuery} onChange={onSearchChange} />

      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          value={severityFilter}
          onChange={(v) => onSeverityChange(v as AlertSeverity | 'All')}
          ariaLabel="Filter by severity"
          options={[
            { value: 'All', label: 'All severities' },
            { value: 'Critical', label: 'Critical' },
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' },
            { value: 'Informational', label: 'Informational' },
          ]}
        />

        <FilterSelect
          value={statusFilter}
          onChange={(v) => onStatusChange(v as AlertStatus | 'All')}
          ariaLabel="Filter by status"
          options={[
            { value: 'All', label: 'All statuses' },
            { value: 'Open', label: 'Open' },
            { value: 'Acknowledged', label: 'Acknowledged' },
            { value: 'Investigating', label: 'Investigating' },
            { value: 'Resolved', label: 'Resolved' },
          ]}
        />

        <FilterSelect
          value={environmentFilter}
          onChange={(v) => onEnvironmentChange(v as ServerEnvironment | 'All')}
          ariaLabel="Filter by environment"
          options={[
            { value: 'All', label: 'All environments' },
            { value: 'Production', label: 'Production' },
            { value: 'Staging', label: 'Staging' },
            { value: 'Development', label: 'Development' },
          ]}
        />

        <FilterSelect
          value={sourceFilter}
          onChange={onSourceChange}
          ariaLabel="Filter by alert source"
          options={[{ value: 'All', label: 'All sources' }, ...getAlertSources().map((s) => ({ value: s, label: s }))]}
        />

        <FilterSelect
          value={sortBy}
          onChange={(v) => onSortChange(v as AlertSortOption)}
          ariaLabel="Sort alerts"
          options={[
            { value: 'trigger-desc', label: 'Newest first' },
            { value: 'trigger-asc', label: 'Oldest first' },
            { value: 'severity', label: 'Severity (high to low)' },
            { value: 'duration-desc', label: 'Longest active' },
          ]}
        />
      </div>
    </div>
  )
}
