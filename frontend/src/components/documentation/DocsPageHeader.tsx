import { BookOpen, FolderKanban, RefreshCcw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface DocsPageHeaderProps {
  totalCount: number
  categoryCount: number
  recentlyUpdatedCount: number
}

function StatChip({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--active-nav-bg)] text-[var(--primary)]">
        <Icon size={16} />
      </span>
      <div>
        <p className="text-lg font-semibold leading-none text-[var(--foreground)]">{value}</p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">{label}</p>
      </div>
    </div>
  )
}

export function DocsPageHeader({ totalCount, categoryCount, recentlyUpdatedCount }: DocsPageHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Documentation</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Runbooks and operational guidance for your engineering teams</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatChip label="Total Documents" value={totalCount} icon={BookOpen} />
        <StatChip label="Categories" value={categoryCount} icon={FolderKanban} />
        <StatChip label="Updated in the Last Week" value={recentlyUpdatedCount} icon={RefreshCcw} />
      </div>
    </div>
  )
}
