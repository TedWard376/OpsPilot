import { AlertCircle, AlertTriangle, CheckCircle2, Siren } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface AlertsPageHeaderProps {
  totalActiveCount: number
  criticalCount: number
  warningCount: number
  acknowledgedCount: number
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

export function AlertsPageHeader({ totalActiveCount, criticalCount, warningCount, acknowledgedCount }: AlertsPageHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Alerts</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Real-time infrastructure alerts across your environment</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatChip label="Total Active Alerts" value={totalActiveCount} icon={AlertCircle} tone="bg-[var(--active-nav-bg)] text-[var(--primary)]" />
        <StatChip label="Critical Alerts" value={criticalCount} icon={Siren} tone="bg-red-50 text-red-600" />
        <StatChip label="Warning Alerts" value={warningCount} icon={AlertTriangle} tone="bg-amber-50 text-amber-600" />
        <StatChip label="Acknowledged Alerts" value={acknowledgedCount} icon={CheckCircle2} tone="bg-blue-50 text-blue-600" />
      </div>
    </div>
  )
}
