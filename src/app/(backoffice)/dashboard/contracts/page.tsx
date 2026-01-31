'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import {
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { usePagination } from '@/hooks/use-pagination'
import { formatDateShort } from '@/utils/date'

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
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export default function ContractsPage() {
  const queryClient = useQueryClient()
  const [filterStatus, setFilterStatus] = useState('')
  const [filterOrigin, setFilterOrigin] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const { page, limit, setPage, nextPage, prevPage } = usePagination()

  const {
    data: paginatedResult,
    isLoading,
    error
  } = useQuery({
    queryKey: [
      'contracts',
      filterStatus,
      filterOrigin,
      searchQuery,
      page,
      limit
    ],
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
  const totalPages = paginatedResult?.meta?.totalPages || 1

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-500/20 text-gray-300'
      case 'Active':
        return 'bg-green-500/20 text-green-300'
      case 'Expired':
        return 'bg-orange-500/20 text-orange-300'
      case 'Terminated':
        return 'bg-red-500/20 text-red-300'
      default:
        return 'bg-zinc-500/20 text-zinc-300'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Contract Management</h1>
          <p className="text-zinc-400 mt-1">Manage and track all contracts</p>
        </div>
        <Link
          href="/dashboard/contracts/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <PlusCircle size={20} />
          <span>New Contract</span>
        </Link>
      </div>

      {/* Filters */}
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

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950">
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Contract #
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Origin
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Created
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
                  Failed to load contracts. Please try again.
                </td>
              </tr>
            ) : !contracts || contracts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-zinc-500"
                >
                  No contracts found. Create your first contract to get started.
                </td>
              </tr>
            ) : (
              contracts.map(contract => (
                <tr
                  key={contract.id}
                  className="border-b border-zinc-800 hover:bg-zinc-850/50"
                >
                  <td className="px-6 py-4 text-indigo-400 font-mono font-medium">
                    {contract.contract_number}
                  </td>
                  <td className="px-6 py-4 text-white">{contract.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusColor(contract.current_status)}`}
                    >
                      {contract.current_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{contract.origin}</td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">
                    {formatDateShort(contract.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/contracts/${contract.id}`}
                        className="p-2 text-zinc-400 hover:text-indigo-400 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(contract.id)}
                        className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
    </div>
  )
}
