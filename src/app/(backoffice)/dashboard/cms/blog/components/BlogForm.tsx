'use client'

import React, { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Button from '@/ui/Button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { revalidateBlogs } from '../actions'
import { ArrowLeft, Upload, Eye, Pencil } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { OutputData } from '@editorjs/editorjs'
import BlogContentRenderer from '@/components/blog/BlogContentRenderer'

const EditorJSComponent = dynamic(
  () => import('@/components/dashboard/EditorJS'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[300px] bg-surface rounded-lg animate-pulse" />
    )
  }
)

interface BlogFormProps {
  initialData?: any
  isEdit?: boolean
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const BlogForm = ({ initialData, isEdit = false }: BlogFormProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    status: initialData?.status || 'draft',
    thumbnail_media_id: initialData?.thumbnail_media_id || null
  })

  const [editorData, setEditorData] = useState<OutputData | undefined>(
    initialData?.content?.blocks ? initialData.content : undefined
  )
  const editorDataRef = useRef<OutputData | undefined>(editorData)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleEditorChange = useCallback((data: OutputData) => {
    editorDataRef.current = data
    setEditorData(data)
  }, [])

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: slugManuallyEdited ? prev.slug : slugify(value)
    }))
  }

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true)
    setFormData(prev => ({ ...prev, slug: value }))
  }

  const uploadFile = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'blogs')
    const res = await apiClient.post('/media', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data.data.id
  }

  const { mutate: submitBlog } = useMutation({
    mutationFn: async () => {
      let thumbnailMediaId = formData.thumbnail_media_id

      if (selectedFile) {
        thumbnailMediaId = await uploadFile(selectedFile)
      }

      const content = editorDataRef.current || { blocks: [] }

      const payload = {
        title: formData.title,
        slug: formData.slug || slugify(formData.title),
        excerpt: formData.excerpt || null,
        content,
        thumbnail_media_id: thumbnailMediaId,
        status: formData.status
      }

      if (isEdit && initialData?.id) {
        return apiClient.put(`/blogs/${initialData.id}`, payload)
      } else {
        return apiClient.post('/blogs', payload)
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      await revalidateBlogs(formData.slug || initialData?.slug)
      router.push('/dashboard/cms/blog')
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Something went wrong')
      setLoading(false)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    setLoading(true)
    setError(null)
    submitBlog()
  }

  const getPreviewData = () => {
    let thumbnailUrl = initialData?.thumbnail_url
    if (selectedFile) {
      thumbnailUrl = URL.createObjectURL(selectedFile)
    }

    return {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: editorDataRef.current || { blocks: [] },
      thumbnail_url: thumbnailUrl,
      published_at: new Date().toISOString(), // Preview as "now"
      author: initialData?.author || { name: 'You (Preview)' }
    }
  }

  if (isPreview) {
    return (
      <BlogContentRenderer
        blog={getPreviewData()}
        isPreview={true}
        onBack={() => setIsPreview(false)}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/cms/blog"
            className="p-2 hover:bg-surface-hover rounded-full transition-colors text-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-heading">
            {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsPreview(true)}
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Preview
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            type="text"
            required
            placeholder="Blog post title"
            value={formData.title}
            onChange={e => handleTitleChange(e.target.value)}
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            type="text"
            placeholder="auto-generated-from-title"
            value={formData.slug}
            onChange={e => handleSlugChange(e.target.value)}
          />
          <p className="text-xs text-muted">
            URL: /blogs/{formData.slug || 'your-post-slug'}
          </p>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label>Excerpt</Label>
          <Textarea
            rows={3}
            className="resize-none"
            placeholder="Short summary for preview cards and SEO..."
            value={formData.excerpt}
            onChange={e =>
              setFormData(prev => ({ ...prev, excerpt: e.target.value }))
            }
          />
        </div>

        {/* Thumbnail */}
        <div className="space-y-2">
          <Label>Thumbnail</Label>
          <div className="space-y-4">
            {!selectedFile && initialData?.thumbnail_url && (
              <div className="relative w-full aspect-video md:w-64 rounded-lg overflow-hidden bg-surface border border-default">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={initialData.thumbnail_url}
                  alt="Current Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-default rounded-lg cursor-pointer hover:border-primary hover:bg-surface transition-all"
              >
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-heading font-medium">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Click to change selection
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-6 h-6 text-muted mb-2" />
                    <span className="text-sm text-muted">
                      {initialData?.thumbnail_url
                        ? 'Change thumbnail'
                        : 'Upload thumbnail'}
                    </span>
                    <span className="text-xs text-muted mt-1">
                      Supports JPG, PNG, WEBP
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Content (Editor.js) */}
        <div className="space-y-2">
          <Label>Content</Label>
          <EditorJSComponent
            initialData={editorData}
            onChange={handleEditorChange}
          />
        </div>

        {/* Status Toggle */}
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex gap-4">
            {(['draft', 'published'] as const).map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status }))}
                className={`px-4 py-2 rounded-lg border capitalize transition-all ${
                  formData.status === status
                    ? status === 'published'
                      ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20'
                      : 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-surface border-default text-muted hover:border-primary/50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
