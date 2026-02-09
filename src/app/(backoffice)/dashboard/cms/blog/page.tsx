'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import Button from '@/ui/Button'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { revalidateBlogs } from './actions'
import {
  DataTable,
  StatusBadge,
  ActionButton,
  type Column
} from '@/components/dashboard/DataTable'
import dayjs from '@/utils/dayjs'
import PermissionGate from '@/components/dashboard/PermissionGate'

interface BlogItem {
  id: string
  title: string
  slug: string
  status: string
  thumbnail_url: string | null
  published_at: string | null
  created_at: string
}

const statusFilterOptions = [
  { label: 'All', value: '' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' }
]

const BlogsPage = () => {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogs', statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      params.set('page', String(page))
      params.set('limit', String(limit))
      const res = await apiClient.get(`/blogs?${params.toString()}`)
      return res.data
    }
  })

  const blogs: BlogItem[] = data?.data || []
  const meta = data?.meta

  const { mutate: deleteBlog } = useMutation({
    mutationFn: async (blog: BlogItem) => {
      await apiClient.delete(`/blogs/${blog.id}`)
      return blog.slug
    },
    onSuccess: async (slug) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      await revalidateBlogs(slug)
    }
  })

  const handleDelete = (blog: BlogItem) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deleteBlog(blog)
    }
  }

  const columns: Column<BlogItem>[] = [
    {
      header: 'Thumbnail',
      cell: (blog) =>
        blog.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.thumbnail_url}
            alt={blog.title}
            className="w-16 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-10 bg-surface rounded flex items-center justify-center text-muted text-xs">
            No img
          </div>
        ),
      hideOnMobile: true
    },
    {
      header: 'Title',
      cell: (blog) => (
        <span className="text-heading font-medium">{blog.title}</span>
      )
    },
    {
      header: 'Status',
      cell: (blog) => (
        <StatusBadge
          status={blog.status === 'published' ? 'Published' : 'Draft'}
          colorMap={{
            Published: 'badge-success',
            Draft: 'badge-default'
          }}
        />
      )
    },
    {
      header: 'Published',
      cell: (blog) => (
        <span className="text-muted text-sm">
          {blog.published_at
            ? dayjs(blog.published_at).format('MMM D, YYYY')
            : '—'}
        </span>
      ),
      hideOnMobile: true
    },
    {
      header: 'Actions',
      align: 'right',
      cell: (blog) => (
        <div className="flex justify-end gap-2">
          <ActionButton
            href={`/dashboard/cms/blog/${blog.id}`}
            icon={<Edit2 className="w-4 h-4" />}
            title="Edit"
          />
          <ActionButton
            onClick={() => handleDelete(blog)}
            icon={<Trash2 className="w-4 h-4" />}
            variant="danger"
            title="Delete"
          />
        </div>
      )
    }
  ]

  return (
    <PermissionGate>
    <div className="p-4 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
      <DataTable
        title="Blog Posts"
        data={blogs}
        columns={columns}
        isLoading={isLoading}
        error={isError}
        emptyMessage='No blog posts found. Click "New Post" to create one.'
        keyExtractor={(blog) => blog.id}
        pagination={meta}
        currentPage={page}
        onNextPage={() => setPage((p) => p + 1)}
        onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
        headerActions={
          <Link href="/dashboard/cms/blog/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        }
        searchSlot={
          <div className="flex gap-2">
            {statusFilterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setStatusFilter(opt.value)
                  setPage(1)
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === opt.value
                    ? 'bg-primary text-white'
                    : 'bg-surface text-muted hover:bg-surface-hover'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        }
      />
    </div>
    </PermissionGate>
  )
}

export default BlogsPage
