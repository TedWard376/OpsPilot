import { AlertOctagon, ListChecks, Plus, Siren } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface IncidentPageHeaderProps {
  totalCount: number
  openCount: number
  criticalCount: number
  onCreateClick: () => void
}

function StatChip({ label, value, icon: Icon, tone }: { label: string; value: number; icon: LucideIcon; tone: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}>
        <Icon size={16} />
      </span>
      <div>
        <p className="text-lg font-semibold leading-none text-[var(--foreground)]">{value}</p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">{label}</p>
      </div>
    </div>
  )
}

export function IncidentPageHeader({ totalCount, openCount, criticalCount, onCreateClick }: IncidentPageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Incidents</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Monitor and manage active incidents across your infrastructure</p>
        </div>

        <button
          type="button"
          onClick={onCreateClick}
          className="inline-flex items-center gap-1.5 self-start rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Create Incident
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatChip label="Total Incidents" value={totalCount} icon={ListChecks} tone="bg-[var(--active-nav-bg)] text-[var(--primary)]" />
        <StatChip label="Open Incidents" value={openCount} icon={AlertOctagon} tone="bg-amber-50 text-amber-600" />
        <StatChip label="Critical Incidents" value={criticalCount} icon={Siren} tone="bg-red-50 text-red-600" />
      </div>
    </div>
  )
}
