'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import { PlusCircle, Pencil, Trash2, Search, Book } from 'lucide-react'
import Button from '@/ui/Button'
import { usePagination } from '@/hooks/use-pagination'
import {
  DataTable,
  Column,
  StatusBadge,
  ActionButton,
  PaginationMeta
} from '@/components/dashboard/DataTable'

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
  meta: PaginationMeta
}

const partyTypeColors: Record<string, string> = {
  Individual: 'badge-info',
  Legal: 'bg-secondary/20 text-secondary-dark dark:bg-purple-500/20 dark:text-purple-300'
}

export default function PartiesPage() {
  const queryClient = useQueryClient()
  const { page, limit, nextPage, prevPage } = usePagination()
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: paginatedResult,
    isLoading,
    isError
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
  const meta = paginatedResult?.meta

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

  const columns: Column<Party>[] = [
    {
      header: 'Type',
      cell: item => (
        <StatusBadge status={item.party_type} colorMap={partyTypeColors} />
      )
    },
    {
      header: 'Legal Name',
      accessorKey: 'legal_name',
      className: 'text-heading font-medium'
    },
    {
      header: 'Display Name',
      cell: item => (
        <span className="text-body">{item.display_name || '-'}</span>
      )
    },
    {
      header: 'Tax ID',
      cell: item => (
        <span className="text-muted font-mono text-sm">
          {item.tax_id || '-'}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      cell: item => (
        <div className="flex justify-end gap-1">
          <ActionButton
            href={`/dashboard/parties/${item.id}`}
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
    <>
      <Link href="/dashboard/parties/docs" className="hidden sm:block">
        <Button variant="outline" size="md" className="!rounded-lg gap-2">
          <Book size={20} />
          <span>API Docs</span>
        </Button>
      </Link>
      <Link href="/dashboard/parties/new">
        <Button variant="primary" size="md" className="!rounded-lg gap-2 w-full sm:w-auto">
          <PlusCircle size={20} />
          <span>Add Party</span>
        </Button>
      </Link>
    </>
  )

  const searchSlot = (
    <div className="relative w-full lg:max-w-md">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        size={18}
      />
      <input
        type="text"
        placeholder="Search by legal name, display name, or tax ID..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="input-base pl-10"
      />
    </div>
  )

  return (
    <DataTable
      data={parties}
      columns={columns}
      keyExtractor={item => item.id}
      isLoading={isLoading}
      error={isError}
      emptyMessage="No parties found. Create your first party to get started."
      errorMessage="Failed to load parties. Please try again."
      title="Parties Management"
      subtitle="Manage contract parties and legal entities"
      headerActions={headerActions}
      searchSlot={searchSlot}
      pagination={meta}
      currentPage={page}
      onNextPage={nextPage}
      onPrevPage={prevPage}
    />
  )
}
