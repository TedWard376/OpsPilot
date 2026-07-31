import { useMemo, useState } from 'react'
import type { DocCategory, DocItem } from '../types/documentation'

export type DocSortOption = 'updated-desc' | 'updated-asc' | 'title-asc'

const PAGE_SIZE = 8

function sortDocs(docs: DocItem[], sortBy: DocSortOption): DocItem[] {
  const sorted = [...docs]

  switch (sortBy) {
    case 'updated-asc':
      return sorted.sort((a, b) => new Date(a.lastUpdatedISO).getTime() - new Date(b.lastUpdatedISO).getTime())
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'updated-desc':
    default:
      return sorted.sort((a, b) => new Date(b.lastUpdatedISO).getTime() - new Date(a.lastUpdatedISO).getTime())
  }
}

function filterDocs(docs: DocItem[], searchQuery: string, categoryFilter: DocCategory | 'All', tagFilter: string | 'All'): DocItem[] {
  const query = searchQuery.trim().toLowerCase()

  return docs.filter((doc) => {
    const matchesSearch =
      query === '' ||
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(query))

    const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter
    const matchesTag = tagFilter === 'All' || doc.tags.includes(tagFilter)

    return matchesSearch && matchesCategory && matchesTag
  })
}

export function useDocumentationList(allDocs: DocItem[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<DocCategory | 'All'>('All')
  const [tagFilter, setTagFilter] = useState<string | 'All'>('All')
  const [sortBy, setSortBy] = useState<DocSortOption>('updated-desc')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredDocs = useMemo(
    () => filterDocs(allDocs, searchQuery, categoryFilter, tagFilter),
    [allDocs, searchQuery, categoryFilter, tagFilter],
  )

  const sortedDocs = useMemo(() => sortDocs(filteredDocs, sortBy), [filteredDocs, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedDocs.length / PAGE_SIZE))

  const paginatedDocs = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages)
    const start = (safePage - 1) * PAGE_SIZE
    return sortedDocs.slice(start, start + PAGE_SIZE)
  }, [sortedDocs, currentPage, totalPages])

  function handleSearchChange(value: string) {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  function handleCategoryChange(value: DocCategory | 'All') {
    setCategoryFilter(value)
    setCurrentPage(1)
  }

  function handleTagChange(value: string | 'All') {
    setTagFilter(value)
    setCurrentPage(1)
  }

  function handleSortChange(value: DocSortOption) {
    setSortBy(value)
    setCurrentPage(1)
  }

  function handlePageChange(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return {
    searchQuery,
    categoryFilter,
    tagFilter,
    sortBy,
    currentPage: Math.min(currentPage, totalPages),
    totalPages,
    pageSize: PAGE_SIZE,
    totalCount: allDocs.length,
    filteredCount: sortedDocs.length,
    paginatedDocs,
    handleSearchChange,
    handleCategoryChange,
    handleTagChange,
    handleSortChange,
    handlePageChange,
  }
}
