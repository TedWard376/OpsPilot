import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllDocs, getDocCategories, getDocTags, loadDocCache } from '../services/documentationService'
import { useDocumentationList } from '../hooks/useDocumentationList'
import { DocsPageHeader } from '../components/documentation/DocsPageHeader'
import { DocFilters } from '../components/documentation/DocFilters'
import { DocGrid } from '../components/documentation/DocGrid'
import type { DocItem } from '../types/documentation'

const RECENT_DAYS_THRESHOLD = 7

function Documentation() {
  const navigate = useNavigate()
  const [allDocs, setAllDocs] = useState<DocItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadDocs() {
      try {
        setIsLoading(true)
        await loadDocCache(true)

        if (!cancelled) {
          setAllDocs(getAllDocs())
          setError(null)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load documentation.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadDocs()

    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => getDocCategories(), [allDocs])
  const tags = useMemo(() => getDocTags(), [allDocs])

  const {
    searchQuery,
    categoryFilter,
    tagFilter,
    sortBy,
    currentPage,
    totalPages,
    pageSize,
    filteredCount,
    paginatedDocs,
    handleSearchChange,
    handleCategoryChange,
    handleTagChange,
    handleSortChange,
    handlePageChange,
  } = useDocumentationList(allDocs)

  const recentlyUpdatedCount = useMemo(() => {
    const cutoff = Date.now() - RECENT_DAYS_THRESHOLD * 24 * 60 * 60 * 1000
    return allDocs.filter((doc) => new Date(doc.lastUpdatedISO).getTime() >= cutoff).length
  }, [allDocs])

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">
        Loading documentation…
      </div>
    )
  }

  if (error) {
    return <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">{error}</div>
  }

  return (
    <div className="space-y-5 pb-6">
      <DocsPageHeader totalCount={allDocs.length} categoryCount={categories.length} recentlyUpdatedCount={recentlyUpdatedCount} />

      <DocFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        tagFilter={tagFilter}
        onTagChange={handleTagChange}
        tags={tags}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <DocGrid
        docs={paginatedDocs}
        totalCount={filteredCount}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onDocClick={(doc) => navigate(`/docs/${doc.id}`)}
        onTagClick={handleTagChange}
      />
    </div>
  )
}

export default Documentation
