'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import SignaturePad from '@/components/signature/SignaturePad'
import { Save, Upload, X } from 'lucide-react'
import Image from 'next/image'

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)

  // Fetch current user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiClient.get('/users/me')
      return res.data.data || res.data
    }
  })

  // Upload signature mutation
  const { mutate: uploadSignature, isPending: isUploading } = useMutation({
    mutationFn: async (dataUrl: string) => {
      // Convert data URL to blob
      const blob = await (await fetch(dataUrl)).blob()

      // Create form data
      const formData = new FormData()
      formData.append('file', blob, 'signature.png')
      formData.append('type', 'signature')

      // Upload to media endpoint
      const uploadRes = await apiClient.post('/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const mediaUrl =
        uploadRes.data.data?.public_url || uploadRes.data.public_url

      // Update user profile with signature URL
      await apiClient.put('/users/me', {
        signature_url: mediaUrl
      })

      return mediaUrl
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setShowSignaturePad(false)
      setSignaturePreview(null)
    }
  })

  const handleSaveSignature = (dataUrl: string) => {
    setSignaturePreview(dataUrl)
  }

  const handleUploadSignature = () => {
    if (signaturePreview) {
      uploadSignature(signaturePreview)
    }
  }

  const handleCancelSignature = () => {
    setShowSignaturePad(false)
    setSignaturePreview(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="card-base p-6">
        <h1 className="text-2xl font-bold text-heading mb-6">Profile Settings</h1>

        {/* User Info */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-body mb-2">
              Name
            </label>
            <p className="text-heading">{profile?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-body mb-2">
              Email
            </label>
            <p className="text-heading">{profile?.email || 'N/A'}</p>
          </div>
        </div>

        {/* Signature Section */}
        <div className="border-t border-default pt-6">
          <h2 className="text-xl font-semibold text-heading mb-4">
            Digital Signature
          </h2>

          {profile?.signature_url && !showSignaturePad ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg inline-block">
                <Image
                  src={profile.signature_url}
                  alt="Your signature"
                  width={300}
                  height={150}
                  className="max-w-full h-auto"
                />
              </div>
              <div>
                <button
                  onClick={() => setShowSignaturePad(true)}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Upload size={18} />
                  Update Signature
                </button>
              </div>
            </div>
          ) : !showSignaturePad ? (
            <div>
              <p className="text-muted mb-4">
                You haven't created a digital signature yet. Create one to use
                for approving documents.
              </p>
              <button
                onClick={() => setShowSignaturePad(true)}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Upload size={18} />
                Create Signature
              </button>
            </div>
          ) : null}

          {showSignaturePad && (
            <div className="space-y-4">
              <p className="text-muted text-sm">
                Draw your signature below. This will be used when you approve
                documents.
              </p>

              {!signaturePreview ? (
                <SignaturePad
                  onSave={handleSaveSignature}
                  width={600}
                  height={200}
                />
              ) : (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <Image
                      src={signaturePreview}
                      alt="Signature preview"
                      width={600}
                      height={200}
                      className="max-w-full h-auto"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUploadSignature}
                      disabled={isUploading}
                      className="px-4 py-2 bg-success hover:bg-success-hover text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save size={18} />
                      {isUploading ? 'Uploading...' : 'Confirm & Upload'}
                    </button>
                    <button
                      onClick={() => setSignaturePreview(null)}
                      className="px-4 py-2 bg-neutral-200 dark:bg-zinc-700 hover:bg-neutral-300 dark:hover:bg-zinc-600 text-heading rounded-lg transition-colors"
                    >
                      Redraw
                    </button>
                    <button
                      onClick={handleCancelSignature}
                      className="px-4 py-2 bg-danger hover:bg-danger-hover text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
