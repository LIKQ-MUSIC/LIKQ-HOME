'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Button from '@/ui/Button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { revalidateWorks } from '../actions'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/utils'

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
      router.push('/dashboard/cms/work')
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
          href="/dashboard/cms/work"
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          {isEdit ? 'Edit Work' : 'Create New Work'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            type="text"
            required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <div className="grid grid-cols-3 gap-4">
            {(['link', 'video', 'event'] as WorkCategory[]).map(cat => (
              <button
                type="button"
                key={cat}
                onClick={() => setFormData({ ...formData, category: cat })}
                className={cn(
                  'p-3 rounded-lg border capitalize transition-all',
                  formData.category === cat
                    ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 dark:bg-indigo-600 dark:border-indigo-600'
                    : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            rows={4}
            className="resize-none"
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* Category Specific Fields */}
        <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-xl space-y-6 dark:bg-neutral-900/50 dark:border-neutral-800">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 capitalize flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {formData.category} Details
          </h3>

          {formData.category === 'link' && (
            <>
              <div className="space-y-2">
                <Label>External URL</Label>
                <Input
                  type="url"
                  required
                  placeholder="https://example.com"
                  value={formData.external_url}
                  onChange={e =>
                    setFormData({ ...formData, external_url: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="space-y-4">
                  {!selectedFile && initialData?.image_url && (
                    <div className="relative w-full aspect-video md:w-64 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
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
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-200 rounded-lg cursor-pointer hover:border-primary hover:bg-neutral-50 transition-all dark:border-neutral-700 dark:hover:bg-neutral-800/50"
                    >
                      {selectedFile ? (
                        <div className="text-center">
                          <p className="text-neutral-900 font-medium dark:text-neutral-200">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-neutral-400 mt-1">
                            Click to change selection
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {initialData?.image_url
                              ? 'Change cover image'
                              : 'Upload cover image'}
                          </span>
                          <span className="text-xs text-neutral-400 mt-1">
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
              <Label>YouTube Video ID</Label>
              <Input
                type="text"
                required
                placeholder="e.g. dQw4w9WgXcQ"
                value={formData.youtube_id}
                onChange={e =>
                  setFormData({ ...formData, youtube_id: e.target.value })
                }
              />
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                The ID from the YouTube URL (e.g. youtube.com/watch?v=<b>ID</b>)
              </p>
            </div>
          )}

          {formData.category === 'event' && (
            <>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  type="text"
                  required
                  value={formData.location}
                  onChange={e =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="datetime-local"
                    required
                    value={formData.start_date}
                    onChange={e =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="datetime-local"
                    required
                    value={formData.end_date}
                    onChange={e =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Event URL (Optional)</Label>
                <Input
                  type="url"
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
