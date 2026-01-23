'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Button from '@/ui/Button'
import { ChevronLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { revalidateAboutUs } from '../actions'

const AddAboutUsImagePage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [altText, setAltText] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)
    }
  }

  const { mutate: addImage } = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('No file selected')
      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'about-us')

        const mediaRes = await apiClient.post('/media', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        const mediaId = mediaRes.data.data.id

        await apiClient.post('/about-us/images', {
          media_id: mediaId,
          alt_text: altText
        })
      } finally {
        setIsUploading(false)
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['about-us-images'] })
      await revalidateAboutUs()
      router.push('/dashboard/cms/aboutus')
    },
    onError: error => {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image')
    }
  })

  return (
    <div className="p-8 w-full max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/cms/aboutus">
          <Button variant="ghost" className="p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Add About Us Image
        </h1>
      </div>

      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-400">
            Image Upload
          </label>
          <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {preview ? (
              <div className="relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Upload className="w-8 h-8" />
                <span>Click or drag to upload image</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Alt Text (Description)
          </label>
          <input
            type="text"
            value={altText}
            onChange={e => setAltText(e.target.value)}
            placeholder="e.g. Studio Atmosphere"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            onClick={() => addImage()}
            disabled={!file || isUploading}
            className="w-32"
          >
            {isUploading ? 'Uploading...' : 'Save Image'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddAboutUsImagePage
