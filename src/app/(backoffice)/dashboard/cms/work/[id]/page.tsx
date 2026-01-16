'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import WorkForm from '../components/WorkForm'

export default function EditWorkPage() {
  const { id } = useParams()

  const { data: work, isLoading } = useQuery({
    queryKey: ['work', id],
    queryFn: async () => {
      const res = await apiClient.get(`/works/${id}`)
      return res.data.data
    },
    enabled: !!id
  })

  if (isLoading) return <div className="text-white p-6">Loading...</div>

  if (!work) return <div className="text-white p-6">Work not found</div>

  return <WorkForm initialData={work} isEdit={true} />
}
