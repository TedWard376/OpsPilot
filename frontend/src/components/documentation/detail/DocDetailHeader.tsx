import { User } from 'lucide-react'
import type { DocItem } from '../../../types/documentation'
import { DocTypeBadge } from '../DocTypeBadge'
import { TagPill } from '../TagPill'

interface DocDetailHeaderProps {
  doc: DocItem
}

export function DocDetailHeader({ doc }: DocDetailHeaderProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-sm font-semibold text-blue-600">{doc.id}</span>
        <DocTypeBadge type={doc.type} />
        <TagPill label={doc.category} />
      </div>
      <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{doc.title}</h1>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{doc.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {doc.tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted-foreground)]">
        <span className="inline-flex items-center gap-1">
          <User size={12} />
          {doc.author}
        </span>
        <span>Last updated {doc.lastUpdated}</span>
      </div>
    </div>
  )
}
