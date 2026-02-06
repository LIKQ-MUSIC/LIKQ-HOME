'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import Button from '@/ui/Button'
import { Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { revalidateAboutUs } from './actions'

const AboutUsPage = () => {
  const queryClient = useQueryClient()

  const { data: images, isLoading } = useQuery({
    queryKey: ['about-us-images'],
    queryFn: async () => {
      const res = await apiClient.get('/about-us/images')
      return res.data.data
    }
  })

  const { mutate: deleteImage } = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/about-us/images/${id}`)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['about-us-images'] })
      await revalidateAboutUs()
    }
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      deleteImage(id)
    }
  }

  if (isLoading) return <div className="text-muted">Loading...</div>

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title">
          Manage About Us Images
        </h1>
        <Link href="/dashboard/cms/aboutus/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images?.map((image: any) => (
          <div
            key={image.id}
            className="group relative aspect-video bg-neutral-100 border border-neutral-200 rounded-xl overflow-hidden shadow-sm"
          >
            <Image
              src={image.image_url}
              alt={image.alt_text || 'About Us Image'}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
              <button
                onClick={() => handleDelete(image.id)}
                className="p-3 bg-danger hover:bg-danger-hover rounded-full text-white transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            {image.alt_text && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/80 to-transparent">
                <p className="text-white text-sm truncate">{image.alt_text}</p>
              </div>
            )}
          </div>
        ))}
        {images?.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted border border-dashed border-neutral-300 rounded-xl">
            No images found. Click &quot;Add Image&quot; to upload one.
          </div>
        )}
      </div>
    </div>
  )
}

export default AboutUsPage
