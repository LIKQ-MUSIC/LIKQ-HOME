'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import { PlusCircle, Pencil, Trash2, Search } from 'lucide-react'
import Button from '@/ui/Button'
import { usePagination } from '@/hooks/use-pagination'
import {
  DataTable,
  Column,
  StatusBadge,
  ActionButton,
  PaginationMeta
} from '@/components/dashboard/DataTable'

interface Application {
  id: string
  name: string
  description: string | null
  api_key_prefix: string
  is_active: boolean
  permissions: string[]
  last_used_at: string | null
  created_at: string
}

interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

const statusColors: Record<string, string> = {
  Active: 'badge-success',
  Inactive: 'badge-danger'
}

export default function ApplicationsPage() {
  const queryClient = useQueryClient()
  const { page, limit, nextPage, prevPage } = usePagination()
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: paginatedResult,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['applications', page, limit, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      if (searchQuery) params.append('search', searchQuery)

      const res = await apiClient.get(`/applications?${params}`)
      return res.data as PaginatedResponse<Application>
    }
  })

  const applications = paginatedResult?.data || []
  const meta = paginatedResult?.meta

  const { mutate: deleteApplication } = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/applications/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
    onError: () => {
      alert('Failed to delete application')
    }
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this application? This will invalidate its API key.')) {
      deleteApplication(id)
    }
  }

  const columns: Column<Application>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      className: 'text-heading font-medium'
    },
    {
      header: 'Description',
      cell: item => (
        <span className="text-body">{item.description || '-'}</span>
      )
    },
    {
      header: 'Key Prefix',
      cell: item => (
        <span className="text-muted font-mono text-sm">
          {item.api_key_prefix}****
        </span>
      )
    },
    {
      header: 'Status',
      cell: item => (
        <StatusBadge
          status={item.is_active ? 'Active' : 'Inactive'}
          colorMap={statusColors}
        />
      )
    },
    {
      header: 'Last Used',
      cell: item => (
        <span className="text-muted text-sm">
          {item.last_used_at
            ? new Date(item.last_used_at).toLocaleDateString()
            : 'Never'}
        </span>
      ),
      hideOnMobile: true
    },
    {
      header: 'Created',
      cell: item => (
        <span className="text-muted text-sm">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
      hideOnMobile: true
    },
    {
      header: 'Actions',
      align: 'right',
      cell: item => (
        <div className="flex justify-end gap-1">
          <ActionButton
            href={`/dashboard/applications/${item.id}`}
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
    <Link href="/dashboard/applications/new">
      <Button variant="primary" size="md" className="!rounded-lg gap-2 w-full sm:w-auto">
        <PlusCircle size={20} />
        <span>New Application</span>
      </Button>
    </Link>
  )

  const searchSlot = (
    <div className="relative w-full lg:max-w-md">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        size={18}
      />
      <input
        type="text"
        placeholder="Search by name or description..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="input-base pl-10"
      />
    </div>
  )

  return (
    <DataTable
      data={applications}
      columns={columns}
      keyExtractor={item => item.id}
      isLoading={isLoading}
      error={isError}
      emptyMessage="No applications found. Create your first application to get started."
      errorMessage="Failed to load applications. Please try again."
      title="Applications"
      subtitle="Manage API key applications and their permissions"
      headerActions={headerActions}
      searchSlot={searchSlot}
      pagination={meta}
      currentPage={page}
      onNextPage={nextPage}
      onPrevPage={prevPage}
    />
  )
}
