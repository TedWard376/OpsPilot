import { FolderKanban, User } from 'lucide-react'
import type { DocItem } from '../../types/documentation'
import { DocTypeBadge } from './DocTypeBadge'
import { TagPill } from './TagPill'

interface DocCardProps {
  doc: DocItem
  onClick: (doc: DocItem) => void
  onTagClick: (tag: string) => void
}

export function DocCard({ doc, onClick, onTagClick }: DocCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-shadow hover:shadow-md">
      <button type="button" onClick={() => onClick(doc)} className="text-left">
        <div className="flex items-center gap-2">
          <DocTypeBadge type={doc.type} />
          <span className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <FolderKanban size={12} />
            {doc.category}
          </span>
        </div>
        <h3 className="mt-2.5 text-sm font-semibold leading-5 text-[var(--foreground)]">{doc.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-[var(--muted-foreground)]">{doc.description}</p>
      </button>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {doc.tags.map((tag) => (
          <TagPill key={tag} label={tag} onClick={() => onTagClick(tag)} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs text-[var(--muted-foreground)]">
        <span className="inline-flex items-center gap-1">
          <User size={12} />
          {doc.author}
        </span>
        <span>Updated {doc.lastUpdated}</span>
      </div>
    </div>
  )
}
