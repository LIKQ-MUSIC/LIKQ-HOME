'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import { ArrowLeft, Save, RefreshCw, Copy, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Permission {
  id: number
  slug: string
  description: string | null
}

interface ApplicationFormData {
  name: string
  description: string
  is_active: boolean
  permission_ids: number[]
}

export default function ApplicationFormPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const isNew = params.id === 'new'

  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    description: '',
    is_active: true,
    permission_ids: []
  })
  const [error, setError] = useState<string | null>(null)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Fetch all available permissions
  const { data: allPermissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const res = await apiClient.get('/permissions')
      return res.data as Permission[]
    }
  })

  // Fetch application details if in edit mode
  const { data: application, isLoading: isLoadingApp } = useQuery({
    queryKey: ['application', params.id],
    queryFn: async () => {
      const res = await apiClient.get(`/applications/${params.id}`)
      return res.data
    },
    enabled: !isNew
  })

  // Update form data when application is loaded
  useEffect(() => {
    if (application) {
      setFormData({
        name: application.name,
        description: application.description || '',
        is_active: application.is_active,
        permission_ids: application.permission_ids || []
      })
    }
  }, [application])

  // Create/Update mutation
  const { mutate: saveApplication, isPending } = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      if (isNew) {
        const res = await apiClient.post('/applications', data)
        return res.data
      } else {
        const res = await apiClient.put(`/applications/${params.id}`, data)
        return res.data
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      if (isNew && data.api_key) {
        setGeneratedKey(data.api_key)
      } else {
        router.push('/dashboard/applications')
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save application')
    }
  })

  // Regenerate key mutation
  const { mutate: regenerateKey, isPending: isRegenerating } = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(`/applications/${params.id}/regenerate-key`)
      return res.data
    },
    onSuccess: (data) => {
      if (data.api_key) {
        setGeneratedKey(data.api_key)
      }
      queryClient.invalidateQueries({ queryKey: ['application', params.id] })
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to regenerate API key')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    saveApplication(formData)
  }

  const handlePermissionToggle = (permissionId: number) => {
    setFormData(prev => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permissionId)
        ? prev.permission_ids.filter(id => id !== permissionId)
        : [...prev.permission_ids, permissionId]
    }))
  }

  const handleCopyKey = async () => {
    if (generatedKey) {
      await navigator.clipboard.writeText(generatedKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDismissKey = () => {
    setGeneratedKey(null)
    if (isNew) {
      router.push('/dashboard/applications')
    }
  }

  if (!isNew && isLoadingApp) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-neutral-500">Loading...</div>
      </div>
    )
  }

  // API Key display modal
  if (generatedKey) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              API Key Generated
            </h1>
            <p className="text-neutral-500 mt-1">
              Make sure to copy your API key now. You won&apos;t be able to see it again.
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-amber-800 font-medium text-sm">
              This key will only be shown once. Copy it now and store it securely.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-[#e5e8ed] p-6 space-y-4">
            <Label>Your API Key</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 font-mono text-sm break-all">
                {generatedKey}
              </code>
              <button
                onClick={handleCopyKey}
                className="flex-shrink-0 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} className="text-neutral-500" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleDismissKey}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              I&apos;ve copied the key
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/applications"
          className="p-2 hover:bg-[#f0f2f6] rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-neutral-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {isNew ? 'New Application' : 'Edit Application'}
          </h1>
          <p className="text-neutral-500 mt-1">
            {isNew
              ? 'Create a new API key application'
              : 'Update application details and permissions'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-lg border border-[#e5e8ed] p-6 space-y-6">
          {/* Key prefix display for edit mode */}
          {!isNew && application && (
            <div>
              <Label>API Key</Label>
              <div className="flex items-center gap-3">
                <code className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 font-mono text-sm text-neutral-600">
                  {application.api_key_prefix}****
                </code>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to regenerate this API key? The current key will stop working immediately.')) {
                      regenerateKey()
                    }
                  }}
                  disabled={isRegenerating}
                  className="flex items-center gap-2 px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors text-sm disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isRegenerating ? 'animate-spin' : ''} />
                  <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Key'}</span>
                </button>
              </div>
            </div>
          )}

          <div>
            <Label>Name *</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={e =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. External CRM Integration"
              required
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              className="min-h-[80px]"
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe what this application is used for"
            />
          </div>

          {!isNew && (
            <div>
              <Label>Status</Label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={e =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="rounded border-[#e0e4ea] bg-white text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                />
                <span className="text-neutral-900">Active</span>
              </label>
            </div>
          )}
        </div>

        {/* Permissions */}
        <div className="bg-white rounded-lg border border-[#e5e8ed] p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Permissions</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Select which permissions this application should have
            </p>
          </div>

          <div className="space-y-2">
            {allPermissions.map(permission => (
              <label
                key={permission.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.permission_ids.includes(permission.id)}
                  onChange={() => handlePermissionToggle(permission.id)}
                  className="mt-0.5 rounded border-[#e0e4ea] bg-white text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div>
                  <span className="font-mono text-sm text-neutral-900">
                    {permission.slug}
                  </span>
                  {permission.description && (
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {permission.description}
                    </p>
                  )}
                </div>
              </label>
            ))}

            {allPermissions.length === 0 && (
              <p className="text-sm text-neutral-400 py-4 text-center">
                Loading permissions...
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/applications"
            className="px-6 py-2 border border-[#e0e4ea] text-neutral-500 rounded-lg hover:bg-[#f0f2f6] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            <span>{isPending ? 'Saving...' : isNew ? 'Create Application' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
