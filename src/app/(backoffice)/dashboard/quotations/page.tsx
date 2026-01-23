'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import {
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Book
} from 'lucide-react'
import { usePagination } from '@/hooks/use-pagination'
import { revalidateQuotations } from './actions'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface QuotationItem {
  description: string
  quantity: number
  price: number
}

interface Quotation {
  id: string
  quotation_number: string
  contact_person_id?: string | null
  bill_to_party_id?: string | null
  approver_id?: string | null
  customer_signatory_id?: string | null
  issued_date?: string | null
  valid_until_date?: string | null
  approved_date?: string | null
  accepted_date?: string | null
  status: string
  total_amount: number
  currency: string
  items: QuotationItem[]
  created_at: string
  updated_at: string
}

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'draft':
      return 'bg-gray-500/20 text-gray-300 border-gray-500/20'
    case 'sent':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/20'
    case 'accepted':
      return 'bg-green-500/20 text-green-300 border-green-500/20'
    case 'rejected':
      return 'bg-red-500/20 text-red-300 border-red-500/20'
    default:
      return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/20'
  }
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

const formatCurrency = (amount: number, currency: string = 'THB') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount)
  } catch {
    // Fallback if currency code is invalid
    return `${currency} ${amount.toFixed(2)}`
  }
}

export default function QuotationsPage() {
  const queryClient = useQueryClient()
  const { page, limit, setPage, nextPage, prevPage } = usePagination()
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: paginatedResult,
    isLoading,
    error
  } = useQuery({
    queryKey: ['quotations', page, limit, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      if (searchQuery) params.append('search', searchQuery)

      const res = await apiClient.get(`/quotations?${params}`)
      return res.data as PaginatedResponse<Quotation>
    }
  })

  const quotations = paginatedResult?.data || []
  const totalPages = paginatedResult?.meta?.totalPages || 1

  const { mutate: deleteQuotation } = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/quotations/${id}`)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      await revalidateQuotations()
    },
    onError: () => {
      alert('Failed to delete quotation')
    }
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this quotation?')) {
      deleteQuotation(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Quotations</h1>
          <p className="text-zinc-400 mt-1">Manage quotations</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/quotations/docs"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700"
          >
            <Book size={20} />
            <span>API Docs</span>
          </Link>
          <Link
            href="/dashboard/quotations/new"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <PlusCircle size={20} />
            <span>Create Quotation</span>
          </Link>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by quotation number..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <TooltipProvider>
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950">
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Quotation Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Issued Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Valid Until
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-zinc-600 border-t-indigo-500 rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-red-500"
                  >
                    Failed to load quotations. Please try again.
                  </td>
                </tr>
              ) : !quotations || quotations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    No quotations found. Create your first quotation to get
                    started.
                  </td>
                </tr>
              ) : (
                quotations.map(quotation => (
                  <tr
                    key={quotation.id}
                    className="border-b border-zinc-800 hover:bg-zinc-850/50"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {quotation.quotation_number}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          quotation.status
                        )}`}
                      >
                        {quotation.status || 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {formatCurrency(
                        quotation.total_amount,
                        quotation.currency
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {formatDate(quotation.issued_date)}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {formatDate(quotation.valid_until_date)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(() => {
                          const actions = [
                            {
                              component: (
                                <Tooltip key="edit">
                                  <TooltipTrigger asChild>
                                    <Link
                                      href={`/dashboard/quotations/${quotation.id}`}
                                      className="p-2 text-zinc-400 hover:text-indigo-400 transition-colors"
                                    >
                                      <Pencil size={16} />
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View/Edit</p>
                                  </TooltipContent>
                                </Tooltip>
                              )
                            },
                            {
                              component: (
                                <Tooltip key="delete">
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => handleDelete(quotation.id)}
                                      className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete</p>
                                  </TooltipContent>
                                </Tooltip>
                              )
                            }
                          ]

                          const showSeparator = actions.length > 2

                          return (
                            <div className="flex justify-end items-center gap-2">
                              {actions.map((action, index) => (
                                <React.Fragment key={index}>
                                  {action.component}
                                  {showSeparator && index < actions.length - 1 && (
                                    <span className="text-zinc-600">:</span>
                                  )}
                                </React.Fragment>
                            ))}
                          </div>
                        )
                      })()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </TooltipProvider>

      {/* Pagination Controls */}
      {quotations && quotations.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-sm text-zinc-400">
            Page <span className="font-medium text-white">{page}</span> of{' '}
            <span className="font-medium text-white">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextPage}
              disabled={page >= totalPages}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
