import { useState } from 'react'
import { BookOpen, Gauge, Loader2, Search, ShieldAlert, Sparkles } from 'lucide-react'
import type { AlertAIInvestigation, AlertRiskLevel } from '../../../types/alertDetail'

interface AlertAIInvestigationPanelProps {
  investigation: AlertAIInvestigation
}

const riskStyles: Record<AlertRiskLevel, string> = {
  Critical: 'bg-red-50 text-red-700',
  High: 'bg-orange-50 text-orange-700',
  Medium: 'bg-yellow-50 text-yellow-700',
  Low: 'bg-green-50 text-green-700',
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">{title}</h4>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-[var(--foreground)]">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--primary)]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AlertAIInvestigationPanel({ investigation }: AlertAIInvestigationPanelProps) {
  const [isInvestigating, setIsInvestigating] = useState(false)
  const [lastAnalyzed, setLastAnalyzed] = useState(investigation.lastAnalyzed)

  function handleInvestigate() {
    setIsInvestigating(true)
    // Placeholder for the future AI investigation call — will POST to the
    // investigation endpoint once the AI backend is connected.
    window.setTimeout(() => {
      setIsInvestigating(false)
      setLastAnalyzed('Just now')
    }, 900)
  }

  return (
    <section id="ai-investigation" className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--active-nav-bg)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
            <Sparkles size={16} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">AI Investigation</h2>
            <p className="text-xs text-[var(--muted-foreground)]">Last analyzed {lastAnalyzed}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleInvestigate}
          disabled={isInvestigating}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isInvestigating ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          {isInvestigating ? 'Investigating…' : 'Investigate with AI'}
        </button>
      </div>

      <div className="space-y-6 p-5">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Executive Summary</h4>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{investigation.summary}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ListBlock title="Possible Root Causes" items={investigation.possibleRootCauses} />
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Likely Impact</h4>
            <p className="mt-2 flex gap-2 text-sm leading-6 text-[var(--foreground)]">
              <Gauge size={15} className="mt-0.5 shrink-0 text-[var(--muted-foreground)]" />
              {investigation.likelyImpact}
            </p>
          </div>
        </div>

        <ListBlock title="Suggested Investigation Steps" items={investigation.investigationSteps} />

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Recommended Documentation</h4>
          <ul className="mt-2 space-y-2">
            {investigation.recommendedDocs.map((doc) => (
              <li key={doc.title} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <BookOpen size={14} className="shrink-0 text-[var(--muted-foreground)]" />
                <span>{doc.title}</span>
                <span className="text-xs text-[var(--muted-foreground)]">· {doc.type}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-[var(--page-background)] p-4">
          <div className="flex items-center gap-2">
            <ShieldAlert size={15} className="text-[var(--muted-foreground)]" />
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Risk Assessment</h4>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${riskStyles[investigation.riskLevel]}`}>
              {investigation.riskLevel} Risk
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{investigation.riskAssessment}</p>
        </div>
      </div>
    </section>
  )
}
