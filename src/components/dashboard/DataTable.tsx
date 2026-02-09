'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Title } from '@/ui/Typography'

export interface Column<T> {
  header: React.ReactNode
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
  headerClassName?: string
  align?: 'left' | 'center' | 'right'
  // For mobile card view
  hideOnMobile?: boolean
  mobileLabel?: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  error?: boolean
  emptyMessage?: string
  errorMessage?: string
  keyExtractor: (item: T) => string | number
  onRowClick?: (item: T) => void
  // Pagination
  pagination?: PaginationMeta
  onNextPage?: () => void
  onPrevPage?: () => void
  currentPage?: number
  // Selection
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  // Slots
  headerActions?: React.ReactNode
  searchSlot?: React.ReactNode
  title?: string
  subtitle?: string
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  error,
  emptyMessage = 'No data found.',
  errorMessage = 'Failed to load data. Please try again.',
  keyExtractor,
  onRowClick,
  pagination,
  onNextPage,
  onPrevPage,
  currentPage = 1,
  selectable,
  selectedIds = [],
  onSelectionChange,
  headerActions,
  searchSlot,
  title,
  subtitle
}: DataTableProps<T>) {
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return
    if (checked) {
      onSelectionChange(data.map(item => String(keyExtractor(item))))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectOne = (id: string) => {
    if (!onSelectionChange) return
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  const allSelected = data.length > 0 && selectedIds.length === data.length

  // Get cell content helper
  const getCellContent = (item: T, col: Column<T>) => {
    if (col.cell) return col.cell(item)
    if (col.accessorKey) return item[col.accessorKey] as React.ReactNode
    return null
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      {(title || headerActions) && (
        <div className="page-header">
          <div>
            {title && (
              <Title level={3} className="!text-heading">
                {title}
              </Title>
            )}
            {subtitle && (
              <p className="text-muted mt-1 text-sm lg:text-base">{subtitle}</p>
            )}
          </div>
          {headerActions && <div className="action-group">{headerActions}</div>}
        </div>
      )}

      {/* Search Slot */}
      {searchSlot && <div className="filter-bar">{searchSlot}</div>}

      {/* Desktop Table View */}
      <div className="hidden lg:block card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header-row">
                {selectable && (
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={e => handleSelectAll(e.target.checked)}
                      className="rounded border-[#e0e4ea] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-primary focus:ring-primary"
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`table-header-cell ${col.headerClassName || ''}`}
                    style={{ textAlign: col.align || 'left' }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-6 py-12 text-center text-muted"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-6 py-12 text-center text-danger"
                  >
                    {errorMessage}
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-6 py-12 text-center text-muted"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map(item => {
                  const key = keyExtractor(item)
                  const isSelected = selectedIds.includes(String(key))
                  return (
                    <tr
                      key={key}
                      onClick={() => onRowClick?.(item)}
                      className={`table-row ${
                        onRowClick ? 'cursor-pointer' : ''
                      } ${isSelected ? 'bg-primary/5' : ''}`}
                    >
                      {selectable && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(String(key))}
                            onClick={e => e.stopPropagation()}
                            className="rounded border-[#e0e4ea] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-primary focus:ring-primary"
                          />
                        </td>
                      )}
                      {columns.map((col, idx) => (
                        <td
                          key={idx}
                          className={`table-cell ${col.className || ''}`}
                          style={{ textAlign: col.align || 'left' }}
                        >
                          {getCellContent(item, col)}
                        </td>
                      ))}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination */}
        {pagination && (
          <div className="flex items-center justify-between border-t border-default px-6 py-3 bg-surface">
            <div className="text-sm text-muted">
              Page{' '}
              <span className="font-medium text-heading">
                {pagination.page}
              </span>{' '}
              of{' '}
              <span className="font-medium text-heading">
                {pagination.totalPages}
              </span>
              {pagination.total > 0 && (
                <span className="text-subtle ml-2">
                  ({pagination.total} total)
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onPrevPage}
                disabled={currentPage <= 1}
                className="pagination-btn"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={onNextPage}
                disabled={currentPage >= pagination.totalPages}
                className="pagination-btn"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {isLoading ? (
          <div className="card-base p-8 text-center text-muted">
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span>Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="card-base p-8 text-center text-danger">
            {errorMessage}
          </div>
        ) : data.length === 0 ? (
          <div className="card-base p-8 text-center text-muted">
            {emptyMessage}
          </div>
        ) : (
          data.map(item => {
            const key = keyExtractor(item)
            const isSelected = selectedIds.includes(String(key))
            return (
              <div
                key={key}
                onClick={() => onRowClick?.(item)}
                className={`card-base p-4 ${
                  onRowClick ? 'cursor-pointer active:bg-surface-hover' : ''
                } ${isSelected ? 'ring-2 ring-primary/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {selectable && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectOne(String(key))}
                      onClick={e => e.stopPropagation()}
                      className="mt-1 rounded border-neutral-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-primary focus:ring-primary"
                    />
                  )}
                  <div className="flex-1 min-w-0 space-y-2">
                    {columns
                      .filter(col => !col.hideOnMobile)
                      .map((col, idx) => {
                        const content = getCellContent(item, col)
                        // First column is typically the main identifier
                        if (idx === 0) {
                          return (
                            <div
                              key={idx}
                              className={`font-medium ${col.className || 'text-heading'}`}
                            >
                              {content}
                            </div>
                          )
                        }
                        // Check if it's an actions column (usually last)
                        if (col.header === 'Actions') {
                          return (
                            <div
                              key={idx}
                              className="flex justify-end pt-2 border-t border-default mt-3"
                            >
                              {content}
                            </div>
                          )
                        }
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-muted">
                              {col.mobileLabel || col.header}
                            </span>
                            <span className={col.className || 'text-body'}>
                              {content}
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            )
          })
        )}

        {/* Mobile Pagination */}
        {pagination && data.length > 0 && (
          <div className="flex items-center justify-between card-base px-4 py-3">
            <div className="text-sm text-muted">
              <span className="font-medium text-heading">
                {pagination.page}
              </span>
              {' / '}
              <span className="font-medium text-heading">
                {pagination.totalPages}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onPrevPage}
                disabled={currentPage <= 1}
                className="pagination-btn btn-touch"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={onNextPage}
                disabled={currentPage >= pagination.totalPages}
                className="pagination-btn btn-touch"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper component for status badges
interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  colorMap?: Record<string, string>
}

export function StatusBadge({ status, variant, colorMap }: StatusBadgeProps) {
  let colorClass = 'badge-default'

  if (colorMap && colorMap[status]) {
    colorClass = colorMap[status]
  } else if (variant) {
    const variantColors = {
      default: 'badge-default',
      success: 'badge-success',
      warning: 'badge-warning',
      danger: 'badge-danger',
      info: 'badge-info'
    }
    colorClass = variantColors[variant]
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {status}
    </span>
  )
}

// Helper for action buttons
interface ActionButtonProps {
  icon: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  href?: string
  variant?: 'default' | 'danger'
  title?: string
}

export function ActionButton({
  icon,
  onClick,
  href,
  variant = 'default',
  title
}: ActionButtonProps) {
  const baseClass = 'p-2 transition-colors rounded-lg'
  const variantClass =
    variant === 'danger'
      ? 'btn-action-danger hover:bg-danger/10'
      : 'btn-action-default hover:bg-primary/10'

  if (href) {
    const Link = require('next/link').default
    return (
      <Link
        href={href}
        className={`${baseClass} ${variantClass}`}
        title={title}
      >
        {icon}
      </Link>
    )
  }

  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onClick?.(e)
      }}
      className={`${baseClass} ${variantClass}`}
      title={title}
    >
      {icon}
    </button>
  )
}
