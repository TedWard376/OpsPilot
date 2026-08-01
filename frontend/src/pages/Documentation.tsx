import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllDocs, getDocCategories, getDocTags } from '../services/documentationService'
import { useDocumentationList } from '../hooks/useDocumentationList'
import { DocsPageHeader } from '../components/documentation/DocsPageHeader'
import { DocFilters } from '../components/documentation/DocFilters'
import { DocGrid } from '../components/documentation/DocGrid'

const RECENT_DAYS_THRESHOLD = 7

function Documentation() {
  const navigate = useNavigate()
  const allDocs = useMemo(() => getAllDocs(), [])
  const categories = useMemo(() => getDocCategories(), [])
  const tags = useMemo(() => getDocTags(), [])

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
