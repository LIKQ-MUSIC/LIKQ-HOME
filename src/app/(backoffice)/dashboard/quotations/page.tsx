'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import { PlusCircle, Pencil, Trash2, Search, Book } from 'lucide-react'
import { usePagination } from '@/hooks/use-pagination'
import { revalidateQuotations } from './actions'
import { formatDateShort } from '@/utils/date'
import {
  DataTable,
  Column,
  StatusBadge,
  ActionButton,
  PaginationMeta
} from '@/components/dashboard/DataTable'

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
  meta: PaginationMeta
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-300',
  sent: 'bg-blue-500/20 text-blue-300',
  accepted: 'bg-green-500/20 text-green-300',
  approved: 'bg-green-500/20 text-green-300',
  rejected: 'bg-red-500/20 text-red-300'
}

const formatCurrency = (amount: number, currency: string = 'THB') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export default function QuotationsPage() {
  const queryClient = useQueryClient()
  const { page, limit, nextPage, prevPage } = usePagination()
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: paginatedResult,
    isLoading,
    isError
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
  const meta = paginatedResult?.meta

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

  const columns: Column<Quotation>[] = [
    {
      header: 'Quotation Number',
      accessorKey: 'quotation_number',
      className: 'text-white font-medium'
    },
    {
      header: 'Status',
      cell: item => (
        <StatusBadge
          status={item.status || 'Draft'}
          colorMap={statusColors}
        />
      )
    },
    {
      header: 'Total Amount',
      cell: item => (
        <span className="text-zinc-300">
          {formatCurrency(item.total_amount, item.currency)}
        </span>
      )
    },
    {
      header: 'Issued Date',
      cell: item => (
        <span className="text-zinc-400">
          {formatDateShort(item.issued_date ?? undefined)}
        </span>
      )
    },
    {
      header: 'Valid Until',
      cell: item => (
        <span className="text-zinc-400">
          {formatDateShort(item.valid_until_date ?? undefined)}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      cell: item => (
        <div className="flex justify-end gap-1">
          <ActionButton
            href={`/dashboard/quotations/${item.id}`}
            icon={<Pencil size={16} />}
            title="View/Edit"
          />
          <ActionButton
            onClick={() => handleDelete(item.id)}
            icon={<Trash2 size={16} />}
            variant="danger"
            title="Delete"
          />
        </div>
      )
    }
  ]

  const headerActions = (
    <>
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
    </>
  )

  const searchSlot = (
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
  )

  return (
    <DataTable
      data={quotations}
      columns={columns}
      keyExtractor={item => item.id}
      isLoading={isLoading}
      error={isError}
      emptyMessage="No quotations found. Create your first quotation to get started."
      errorMessage="Failed to load quotations. Please try again."
      title="Quotations"
      subtitle="Manage quotations"
      headerActions={headerActions}
      searchSlot={searchSlot}
      pagination={meta}
      currentPage={page}
      onNextPage={nextPage}
      onPrevPage={prevPage}
    />
  )
}
