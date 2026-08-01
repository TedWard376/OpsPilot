import { Sparkles } from 'lucide-react'
import type { AIInsight } from '../../types/reports'

interface AIInsightsPanelProps {
  insights: AIInsight[]
}

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] bg-[var(--active-nav-bg)] px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
          <Sparkles size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">AI Insights</h2>
          <p className="text-xs text-[var(--muted-foreground)]">Placeholder — not yet connected to live analysis</p>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {insights.map((insight) => (
          <div key={insight.id} className="rounded-lg border border-[var(--border)] bg-[var(--page-background)] p-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">{insight.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-[var(--muted-foreground)]">{insight.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
