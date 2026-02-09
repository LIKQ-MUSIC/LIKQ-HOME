'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import Button from '@/ui/Button'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { revalidateWorks } from './actions'
import PermissionGate from '@/components/dashboard/PermissionGate'

const WorksPage = () => {
  const queryClient = useQueryClient()

  const { data: works, isLoading } = useQuery({
    queryKey: ['works'],
    queryFn: async () => {
      const res = await apiClient.get('/works')
      return res.data.data
    }
  })

  const { mutate: deleteWork } = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/works/${id}`)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['works'] })
      await revalidateWorks()
    }
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this work?')) {
      deleteWork(id)
    }
  }

  if (isLoading) return <div className="text-muted">Loading...</div>

  return (
    <PermissionGate>
    <div className="p-8 w-full max-w-7xl mx-auto space-y-8">
      <div className="page-header">
        <h1 className="page-title">Manage Works</h1>
        <Link href="/dashboard/cms/work/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Work
          </Button>
        </Link>
      </div>

      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="table-header-row">
                <th className="table-header-cell">Title</th>
                <th className="table-header-cell">Category</th>
                <th className="table-header-cell text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {works?.map((work: any) => (
                <tr key={work.id} className="table-row">
                  <td className="table-cell text-heading font-medium">
                    {work.title}
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${
                        work.category === 'video'
                          ? 'badge-danger'
                          : work.category === 'event'
                            ? 'badge-info'
                            : 'badge-default'
                      }`}
                    >
                      {work.category}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/cms/work/${work.id}`}
                        className="btn-action-default p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(work.id)}
                        className="btn-action-danger p-2 hover:bg-danger/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {works?.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-muted">
                    No works found. Click "Add Work" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </PermissionGate>
  )
}

export default WorksPage
