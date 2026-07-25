import { ChevronDown } from 'lucide-react'
import type { IncidentPriority, IncidentStatus } from '../../data/incidents'
import { incidentAffectedSystems, incidentEngineers } from '../../data/incidents'
import { IncidentSearch } from './IncidentSearch'

interface IncidentFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: IncidentStatus | 'All'
  onStatusChange: (value: IncidentStatus | 'All') => void
  priorityFilter: IncidentPriority | 'All'
  onPriorityChange: (value: IncidentPriority | 'All') => void
  engineerFilter: string
  onEngineerChange: (value: string) => void
  systemFilter: string
  onSystemChange: (value: string) => void
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

export function IncidentFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  engineerFilter,
  onEngineerChange,
  systemFilter,
  onSystemChange,
}: IncidentFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <IncidentSearch value={searchQuery} onChange={onSearchChange} />

      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          value={statusFilter}
          onChange={(v) => onStatusChange(v as IncidentStatus | 'All')}
          ariaLabel="Filter by status"
          options={[
            { value: 'All', label: 'All statuses' },
            { value: 'Open', label: 'Open' },
            { value: 'Investigating', label: 'Investigating' },
            { value: 'Monitoring', label: 'Monitoring' },
            { value: 'Resolved', label: 'Resolved' },
            { value: 'Closed', label: 'Closed' },
          ]}
        />

        <FilterSelect
          value={priorityFilter}
          onChange={(v) => onPriorityChange(v as IncidentPriority | 'All')}
          ariaLabel="Filter by priority"
          options={[
            { value: 'All', label: 'All priorities' },
            { value: 'Critical', label: 'Critical' },
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' },
          ]}
        />

        <FilterSelect
          value={engineerFilter}
          onChange={onEngineerChange}
          ariaLabel="Filter by assigned engineer"
          options={[{ value: 'All', label: 'All engineers' }, ...incidentEngineers.map((e) => ({ value: e, label: e }))]}
        />

        <FilterSelect
          value={systemFilter}
          onChange={onSystemChange}
          ariaLabel="Filter by affected system"
          options={[{ value: 'All', label: 'All systems' }, ...incidentAffectedSystems.map((s) => ({ value: s, label: s }))]}
        />
      </div>
    </div>
  )
}
