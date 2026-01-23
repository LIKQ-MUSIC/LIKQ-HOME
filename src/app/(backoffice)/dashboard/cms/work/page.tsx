'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import Button from '@/ui/Button'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { revalidateWorks } from './actions'

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

  if (isLoading) return <div className="text-white">Loading...</div>

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Manage Works
        </h1>
        <Link href="/dashboard/cms/work/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Work
          </Button>
        </Link>
      </div>

      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 font-medium">
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {works?.map((work: any) => (
                <tr
                  key={work.id}
                  className="hover:bg-white/5 transition-colors duration-200 group"
                >
                  <td className="p-4 text-white font-medium">{work.title}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${
                        work.category === 'video'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : work.category === 'event'
                            ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}
                    >
                      {work.category}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2 text-gray-400">
                    <Link
                      href={`/dashboard/cms/work/${work.id}`}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(work.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {works?.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No works found. Click "Add Work" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default WorksPage
