'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Button from '@/ui/Button'
import { revalidateWorks } from '../actions'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'

type WorkCategory = 'video' | 'event' | 'link'

interface WorkFormProps {
  initialData?: any
  isEdit?: boolean
}

const WorkForm = ({ initialData, isEdit = false }: WorkFormProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: (initialData?.category as WorkCategory) || 'link',
    description: initialData?.description || '',
    youtube_id: initialData?.youtube_id || '',
    external_url: initialData?.external_url || '',
    location: initialData?.location || '',
    start_date: initialData?.start_date
      ? new Date(initialData.start_date).toISOString().slice(0, 16)
      : '',
    end_date: initialData?.end_date
      ? new Date(initialData.end_date).toISOString().slice(0, 16)
      : '',
    media_ids: initialData?.media_ids || []
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'works')
    const res = await apiClient.post('/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data.data.id
  }

  const { mutate: submitWork } = useMutation({
    mutationFn: async (data: any) => {
      let mediaIds = [...(data.media_ids || [])]

      if (selectedFile) {
        const mediaId = await uploadFile(selectedFile)
        mediaIds = [mediaId] // Assuming one image per work for now
      }

      const payload = {
        ...data,
        media_ids: mediaIds,
        // Clean up empty strings to null/undefined if API expects
        youtube_id: data.category === 'video' ? data.youtube_id : null,
        external_url: data.external_url || null,
        location: data.category === 'event' ? data.location : null,
        start_date:
          data.category === 'event' && data.start_date ? data.start_date : null,
        end_date:
          data.category === 'event' && data.end_date ? data.end_date : null
      }

      if (isEdit && initialData?.id) {
        return apiClient.put(`/works/${initialData.id}`, payload)
      } else {
        return apiClient.post('/works', payload)
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['works'] })
      await revalidateWorks()
      router.push('/works')
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Something went wrong')
      setLoading(false)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    submitWork(formData)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/works"
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">
          {isEdit ? 'Edit Work' : 'Create New Work'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Title
          </label>
          <input
            type="text"
            required
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Category
          </label>
          <div className="grid grid-cols-3 gap-4">
            {(['link', 'video', 'event'] as WorkCategory[]).map(cat => (
              <button
                type="button"
                key={cat}
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`p-3 rounded-lg border capitalize transition-all ${
                  formData.category === cat
                    ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-zinc-900 border-zinc-700 text-gray-400 hover:border-zinc-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Description
          </label>
          <textarea
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* Category Specific Fields */}
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-6">
          <h3 className="text-lg font-medium text-white capitalize flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {formData.category} Details
          </h3>

          {formData.category === 'link' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">
                  External URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.external_url}
                  onChange={e =>
                    setFormData({ ...formData, external_url: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">
                  Cover Image
                </label>
                <div className="space-y-4">
                  {!selectedFile && initialData?.image_url && (
                    <div className="relative w-full aspect-video md:w-64 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={initialData.image_url}
                        alt="Current Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e =>
                        setSelectedFile(e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-zinc-800/50 transition-all"
                    >
                      {selectedFile ? (
                        <div className="text-center">
                          <p className="text-white font-medium">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            Click to change selection
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-6 h-6 text-zinc-500 mb-2" />
                          <span className="text-sm text-zinc-400">
                            {initialData?.image_url
                              ? 'Change cover image'
                              : 'Upload cover image'}
                          </span>
                          <span className="text-xs text-zinc-600 mt-1">
                            Supports JPG, PNG, WEBP
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {formData.category === 'video' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                YouTube Video ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. dQw4w9WgXcQ"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.youtube_id}
                onChange={e =>
                  setFormData({ ...formData, youtube_id: e.target.value })
                }
              />
              <p className="text-xs text-zinc-500">
                The ID from the YouTube URL (e.g. youtube.com/watch?v=<b>ID</b>)
              </p>
            </div>
          )}

          {formData.category === 'event' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">
                  Location
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.location}
                  onChange={e =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.start_date}
                    onChange={e =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.end_date}
                    onChange={e =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">
                  Event URL (Optional)
                </label>
                <input
                  type="url"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.external_url}
                  onChange={e =>
                    setFormData({ ...formData, external_url: e.target.value })
                  }
                />
              </div>
            </>
          )}
        </div>

        <div className="pt-4 flex justify-end">
          <Button disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Work' : 'Create Work'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default WorkForm
