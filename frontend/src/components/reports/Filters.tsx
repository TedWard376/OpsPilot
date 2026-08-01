import { ChevronDown, RotateCcw } from 'lucide-react'
import type { IncidentCategory, ReportEnvironment, ReportFilters as ReportFiltersType, ReportSeverity } from '../../types/reports'

interface FiltersProps {
  filters: ReportFiltersType
  environments: ReportEnvironment[]
  severities: ReportSeverity[]
  categories: IncidentCategory[]
  onDateRangeChange: (value: ReportFiltersType['dateRange']) => void
  onSeverityChange: (value: ReportSeverity | 'All') => void
  onEnvironmentChange: (value: ReportEnvironment | 'All') => void
  onCategoryChange: (value: IncidentCategory | 'All') => void
  onReset: () => void
  isFiltered: boolean
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
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden />
    </div>
  )
}

export function Filters({
  filters,
  environments,
  severities,
  categories,
  onDateRangeChange,
  onSeverityChange,
  onEnvironmentChange,
  onCategoryChange,
  onReset,
  isFiltered,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm">
      <FilterSelect
        value={filters.dateRange}
        onChange={(v) => onDateRangeChange(v as ReportFiltersType['dateRange'])}
        ariaLabel="Date range"
        options={[
          { value: '3m', label: 'Last 3 Months' },
          { value: '6m', label: 'Last 6 Months' },
          { value: '12m', label: 'Last 12 Months' },
        ]}
      />

      <FilterSelect
        value={filters.severity}
        onChange={(v) => onSeverityChange(v as ReportSeverity | 'All')}
        ariaLabel="Filter by severity"
        options={[{ value: 'All', label: 'All Severities' }, ...severities.map((s) => ({ value: s, label: s }))]}
      />

      <FilterSelect
        value={filters.environment}
        onChange={(v) => onEnvironmentChange(v as ReportEnvironment | 'All')}
        ariaLabel="Filter by environment"
        options={[{ value: 'All', label: 'All Environments' }, ...environments.map((e) => ({ value: e, label: e }))]}
      />

      <FilterSelect
        value={filters.category}
        onChange={(v) => onCategoryChange(v as IncidentCategory | 'All')}
        ariaLabel="Filter by incident category"
        options={[{ value: 'All', label: 'All Categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
      />

      {isFiltered && (
        <button
          type="button"
          onClick={onReset}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--page-background)] hover:text-[var(--foreground)]"
        >
          <RotateCcw size={13} />
          Reset filters
        </button>
      )}
    </div>
  )
}
