import { ChevronDown } from 'lucide-react'
import type { DocCategory } from '../../types/documentation'
import type { DocSortOption } from '../../hooks/useDocumentationList'
import { DocSearch } from './DocSearch'

interface DocFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  categoryFilter: DocCategory | 'All'
  onCategoryChange: (value: DocCategory | 'All') => void
  categories: DocCategory[]
  tagFilter: string | 'All'
  onTagChange: (value: string | 'All') => void
  tags: string[]
  sortBy: DocSortOption
  onSortChange: (value: DocSortOption) => void
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

export function DocFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
  tagFilter,
  onTagChange,
  tags,
  sortBy,
  onSortChange,
}: DocFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <DocSearch value={searchQuery} onChange={onSearchChange} />

      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          value={categoryFilter}
          onChange={(v) => onCategoryChange(v as DocCategory | 'All')}
          ariaLabel="Filter by category"
          options={[{ value: 'All', label: 'All categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
        />

        <FilterSelect
          value={tagFilter}
          onChange={onTagChange}
          ariaLabel="Filter by tag"
          options={[{ value: 'All', label: 'All tags' }, ...tags.map((t) => ({ value: t, label: t }))]}
        />

        <FilterSelect
          value={sortBy}
          onChange={(v) => onSortChange(v as DocSortOption)}
          ariaLabel="Sort documentation"
          options={[
            { value: 'updated-desc', label: 'Recently updated' },
            { value: 'updated-asc', label: 'Oldest updated' },
            { value: 'title-asc', label: 'Title (A–Z)' },
          ]}
        />
      </div>
    </div>
  )
}
