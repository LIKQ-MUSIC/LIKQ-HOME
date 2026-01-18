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
  ChevronRight,
  Book
} from 'lucide-react'
import { usePagination } from '@/hooks/use-pagination'

interface Party {
  id: string
  party_type: 'Individual' | 'Legal'
  legal_name: string
  display_name?: string | null
  tax_id?: string | null
  address?: string | null
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

export default function PartiesPage() {
  const queryClient = useQueryClient()
  const { page, limit, setPage, nextPage, prevPage } = usePagination()
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: paginatedResult,
    isLoading,
    error
  } = useQuery({
    queryKey: ['parties', page, limit, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      if (searchQuery) params.append('search', searchQuery)

      const res = await apiClient.get(`/parties?${params}`)
      return res.data as PaginatedResponse<Party>
    }
  })

  const parties = paginatedResult?.data || []
  const totalPages = paginatedResult?.meta?.totalPages || 1

  const { mutate: deleteParty } = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/parties/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] })
    },
    onError: () => {
      alert('Failed to delete party')
    }
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this party?')) {
      deleteParty(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-zinc-400">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Failed to load parties</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Parties Management</h1>
          <p className="text-zinc-400 mt-1">
            Manage contract parties and legal entities
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/parties/docs"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700"
          >
            <Book size={20} />
            <span>API Docs</span>
          </Link>
          <Link
            href="/dashboard/parties/new"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <PlusCircle size={20} />
            <span>Add Party</span>
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
          placeholder="Search by legal name, display name, or tax ID..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950">
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Legal Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Display Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Tax ID
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!parties || parties.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-zinc-500"
                >
                  No parties found. Create your first party to get started.
                </td>
              </tr>
            ) : (
              parties.map(party => (
                <tr
                  key={party.id}
                  className="border-b border-zinc-800 hover:bg-zinc-850/50"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        party.party_type === 'Individual'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {party.party_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {party.legal_name}
                  </td>
                  <td className="px-6 py-4 text-zinc-300">
                    {party.display_name || '-'}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 font-mono text-sm">
                    {party.tax_id || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/parties/${party.id}`}
                        className="p-2 text-zinc-400 hover:text-indigo-400 transition-colors"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(party.id)}
                        className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
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
