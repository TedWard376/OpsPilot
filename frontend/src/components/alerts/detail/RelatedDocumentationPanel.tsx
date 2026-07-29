import { BookOpen } from 'lucide-react'
import type { RelatedDocRef } from '../../../types/alertDetail'

interface RelatedDocumentationPanelProps {
  docs: RelatedDocRef[]
}

export function RelatedDocumentationPanel({ docs }: RelatedDocumentationPanelProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">Related Documentation</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Recommended runbooks for this alert type</p>
      </div>

      <ul>
        {docs.map((doc) => (
          <li key={doc.title} className="flex items-start gap-3 border-b border-[var(--border)] px-5 py-3 last:border-b-0">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--active-nav-bg)]">
              <BookOpen size={14} className="text-[var(--primary)]" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">{doc.title}</p>
                <span className="shrink-0 rounded-full bg-[var(--page-background)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
                  {doc.type}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{doc.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
