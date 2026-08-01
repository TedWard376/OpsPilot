import { BookOpen } from 'lucide-react'
import type { DocItem } from '../../types/documentation'
import { Pagination } from '../Pagination'
import { DocCard } from './DocCard'

interface DocGridProps {
  docs: DocItem[]
  totalCount: number
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onDocClick: (doc: DocItem) => void
  onTagClick: (tag: string) => void
}

export function DocGrid({ docs, totalCount, currentPage, totalPages, pageSize, onPageChange, onDocClick, onTagClick }: DocGridProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      {docs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
          <BookOpen size={20} className="text-[var(--muted-foreground)]" />
          <p className="text-sm text-[var(--muted-foreground)]">No documentation matches your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {docs.map((doc) => (
            <DocCard key={doc.id} doc={doc} onClick={onDocClick} onTagClick={onTagClick} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
        itemLabel="documents"
      />
    </div>
  )
}
