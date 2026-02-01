'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import { PlusCircle, Pencil, Trash2, Search } from 'lucide-react'
import { usePagination } from '@/hooks/use-pagination'
import { formatDateShort } from '@/utils/date'
import {
  DataTable,
  Column,
  StatusBadge,
  ActionButton,
  PaginationMeta
} from '@/components/dashboard/DataTable'

interface Contract {
  id: string
  contract_number: string
  origin: 'Internal' | 'External'
  title: string
  current_status: 'Draft' | 'Active' | 'Expired' | 'Terminated'
  created_at: string
}

interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-500/20 text-gray-300',
  Active: 'bg-green-500/20 text-green-300',
  Expired: 'bg-orange-500/20 text-orange-300',
  Terminated: 'bg-red-500/20 text-red-300'
}

export default function ContractsPage() {
  const queryClient = useQueryClient()
  const [filterStatus, setFilterStatus] = useState('')
  const [filterOrigin, setFilterOrigin] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const { page, limit, nextPage, prevPage } = usePagination()

  const {
    data: paginatedResult,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['contracts', filterStatus, filterOrigin, searchQuery, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filterStatus) params.append('status', filterStatus)
      if (filterOrigin) params.append('origin', filterOrigin)
      if (searchQuery) params.append('search', searchQuery)
      params.append('page', page.toString())
      params.append('limit', limit.toString())

      const res = await apiClient.get(`/contracts?${params}`)
      return res.data as PaginatedResponse<Contract>
    }
  })

  const contracts = paginatedResult?.data || []
  const meta = paginatedResult?.meta

  const { mutate: deleteContract } = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/contracts/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
    onError: () => {
      alert('Failed to delete contract')
    }
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      deleteContract(id)
    }
  }

  const columns: Column<Contract>[] = [
    {
      header: 'Contract #',
      accessorKey: 'contract_number',
      className: 'text-indigo-400 font-mono font-medium'
    },
    {
      header: 'Title',
      accessorKey: 'title',
      className: 'text-white'
    },
    {
      header: 'Status',
      cell: item => (
        <StatusBadge status={item.current_status} colorMap={statusColors} />
      )
    },
    {
      header: 'Origin',
      cell: item => <span className="text-zinc-300">{item.origin}</span>
    },
    {
      header: 'Created',
      cell: item => (
        <span className="text-zinc-400 text-sm">
          {formatDateShort(item.created_at)}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      cell: item => (
        <div className="flex justify-end gap-1">
          <ActionButton
            href={`/dashboard/contracts/${item.id}`}
            icon={<Pencil size={16} />}
            title="Edit"
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
    <Link
      href="/dashboard/contracts/new"
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
    >
      <PlusCircle size={20} />
      <span>New Contract</span>
    </Link>
  )

  const searchSlot = (
    <div className="flex gap-4">
      <div className="relative flex-1 max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by contract number or title..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <select
        value={filterStatus}
        onChange={e => setFilterStatus(e.target.value)}
        className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:border-indigo-500"
      >
        <option value="">All Statuses</option>
        <option value="Draft">Draft</option>
        <option value="Active">Active</option>
        <option value="Expired">Expired</option>
        <option value="Terminated">Terminated</option>
      </select>

      <select
        value={filterOrigin}
        onChange={e => setFilterOrigin(e.target.value)}
        className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:border-indigo-500"
      >
        <option value="">All Origins</option>
        <option value="Internal">Internal</option>
        <option value="External">External</option>
      </select>
    </div>
  )

  return (
    <DataTable
      data={contracts}
      columns={columns}
      keyExtractor={item => item.id}
      isLoading={isLoading}
      error={isError}
      emptyMessage="No contracts found. Create your first contract to get started."
      errorMessage="Failed to load contracts. Please try again."
      title="Contract Management"
      subtitle="Manage and track all contracts"
      headerActions={headerActions}
      searchSlot={searchSlot}
      pagination={meta}
      currentPage={page}
      onNextPage={nextPage}
      onPrevPage={prevPage}
    />
  )
}
