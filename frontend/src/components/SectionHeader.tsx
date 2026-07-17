/**
 * SectionHeader Component
 * Presentational component that provides consistent section headers across the dashboard:
 * - Title and optional description
 * - Optional action button
 * - Consistent styling with the application theme
 */

interface SectionHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
      <div>
        <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>
        {description && <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>}
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
