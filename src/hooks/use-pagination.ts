import { useState, useCallback } from 'react'

export interface PaginationState {
  page: number
  limit: number
}

export function usePagination(initialPage = 1, initialLimit = 10) {
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit
  })

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 })) // Reset to page 1 on limit change
  }, [])

  const nextPage = useCallback(() => {
    setPagination(prev => ({ ...prev, page: prev.page + 1 }))
  }, [])

  const prevPage = useCallback(() => {
    setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))
  }, [])

  return {
    page: pagination.page,
    limit: pagination.limit,
    setPage,
    setLimit,
    nextPage,
    prevPage
  }
}
