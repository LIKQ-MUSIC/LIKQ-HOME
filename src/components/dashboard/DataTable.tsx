'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface Column<T> {
  header: React.ReactNode
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
  headerClassName?: string
  align?: 'left' | 'center' | 'right'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      {(title || headerActions) && (
        <div className="flex justify-between items-center">
          <div>
            {title && (
              <h1 className="text-3xl font-bold text-white">{title}</h1>
            )}
            {subtitle && <p className="text-zinc-400 mt-1">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex gap-2">{headerActions}</div>}
        </div>
      )}

      {/* Search Slot */}
      {searchSlot}

      {/* Table Container */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950">
                {selectable && (
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={e => handleSelectAll(e.target.checked)}
                      className="rounded border-zinc-600 bg-zinc-800 text-indigo-500 focus:ring-indigo-500"
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-4 text-sm font-semibold text-zinc-300 ${col.headerClassName || ''}`}
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
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-zinc-600 border-t-indigo-500 rounded-full animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-6 py-12 text-center text-red-500"
                  >
                    {errorMessage}
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-6 py-12 text-center text-zinc-500"
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
                      className={`border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors ${
                        onRowClick ? 'cursor-pointer' : ''
                      } ${isSelected ? 'bg-zinc-800/30' : ''}`}
                    >
                      {selectable && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(String(key))}
                            onClick={e => e.stopPropagation()}
                            className="rounded border-zinc-600 bg-zinc-800 text-indigo-500 focus:ring-indigo-500"
                          />
                        </td>
                      )}
                      {columns.map((col, idx) => (
                        <td
                          key={idx}
                          className={`px-6 py-4 ${col.className || ''}`}
                          style={{ textAlign: col.align || 'left' }}
                        >
                          {col.cell
                            ? col.cell(item)
                            : col.accessorKey
                              ? (item[col.accessorKey] as React.ReactNode)
                              : null}
                        </td>
                      ))}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-3 bg-zinc-900">
            <div className="text-sm text-zinc-400">
              Page{' '}
              <span className="font-medium text-white">{pagination.page}</span>{' '}
              of{' '}
              <span className="font-medium text-white">
                {pagination.totalPages}
              </span>
              {pagination.total > 0 && (
                <span className="text-zinc-500 ml-2">
                  ({pagination.total} total)
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onPrevPage}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={onNextPage}
                disabled={currentPage >= pagination.totalPages}
                className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
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
  let colorClass = 'bg-zinc-500/20 text-zinc-300'

  if (colorMap && colorMap[status]) {
    colorClass = colorMap[status]
  } else if (variant) {
    const variantColors = {
      default: 'bg-zinc-500/20 text-zinc-300',
      success: 'bg-green-500/20 text-green-300',
      warning: 'bg-orange-500/20 text-orange-300',
      danger: 'bg-red-500/20 text-red-300',
      info: 'bg-blue-500/20 text-blue-300'
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
  const baseClass =
    'p-2 transition-colors'
  const variantClass =
    variant === 'danger'
      ? 'text-zinc-400 hover:text-red-400'
      : 'text-zinc-400 hover:text-indigo-400'

  if (href) {
    const Link = require('next/link').default
    return (
      <Link href={href} className={`${baseClass} ${variantClass}`} title={title}>
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
