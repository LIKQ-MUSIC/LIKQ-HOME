'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import BlogForm from '../components/BlogForm'
import { Loader2 } from 'lucide-react'
import PermissionGate from '@/components/dashboard/PermissionGate'

export default function EditBlogPage() {
  const { id } = useParams()

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const res = await apiClient.get(`/blogs/${id}`)
      return res.data.data
    },
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!blog) return <div className="text-muted p-6">Blog post not found</div>

  return (
    <PermissionGate>
      <BlogForm initialData={blog} isEdit={true} />
    </PermissionGate>
  )
}
