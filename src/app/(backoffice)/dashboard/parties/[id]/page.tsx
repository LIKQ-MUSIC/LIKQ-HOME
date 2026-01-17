'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

interface PartyFormData {
  party_type: 'Individual' | 'Legal'
  legal_name: string
  display_name: string
  tax_id: string
  address: string
}

export default function PartyFormPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const isNew = params.id === 'new'

  const [formData, setFormData] = useState<PartyFormData>({
    party_type: 'Individual',
    legal_name: '',
    display_name: '',
    tax_id: '',
    address: ''
  })
  const [error, setError] = useState<string | null>(null)

  // Fetch party details if in edit mode
  const { data: party, isLoading: isLoadingParty } = useQuery({
    queryKey: ['party', params.id],
    queryFn: async () => {
      const res = await apiClient.get(`/parties/${params.id}`)
      return res.data
    },
    enabled: !isNew
  })

  // Update form data when party is loaded
  useEffect(() => {
    if (party) {
      setFormData({
        party_type: party.party_type,
        legal_name: party.legal_name,
        display_name: party.display_name || '',
        tax_id: party.tax_id || '',
        address: party.address || ''
      })
    }
  }, [party])

  // Create/Update mutation
  const { mutate: saveParty, isPending } = useMutation({
    mutationFn: async (data: PartyFormData) => {
      if (isNew) {
        await apiClient.post('/parties', data)
      } else {
        await apiClient.put(`/parties/${params.id}`, data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] })
      router.push('/dashboard/parties')
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save party')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    saveParty(formData)
  }

  if (!isNew && isLoadingParty) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-zinc-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/parties"
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-zinc-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isNew ? 'New Party' : 'Edit Party'}
          </h1>
          <p className="text-zinc-400 mt-1">
            {isNew ? 'Create a new party' : 'Update party details'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Party Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="party_type"
                  value="Individual"
                  checked={formData.party_type === 'Individual'}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      party_type: e.target.value as 'Individual' | 'Legal'
                    })
                  }
                  className="text-indigo-600 focus:ring-indigo-500 bg-zinc-950 border-zinc-700"
                />
                <span className="text-white">Individual</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="party_type"
                  value="Legal"
                  checked={formData.party_type === 'Legal'}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      party_type: e.target.value as 'Individual' | 'Legal'
                    })
                  }
                  className="text-indigo-600 focus:ring-indigo-500 bg-zinc-950 border-zinc-700"
                />
                <span className="text-white">Legal Entity</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Legal Name *
            </label>
            <input
              type="text"
              value={formData.legal_name}
              onChange={e =>
                setFormData({ ...formData, legal_name: e.target.value })
              }
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              placeholder={
                formData.party_type === 'Individual'
                  ? 'e.g. John Doe'
                  : 'e.g. Acme Corp Ltd.'
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={formData.display_name}
              onChange={e =>
                setFormData({ ...formData, display_name: e.target.value })
              }
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Artist Name or Trading Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Tax ID
            </label>
            <input
              type="text"
              value={formData.tax_id}
              onChange={e =>
                setFormData({ ...formData, tax_id: e.target.value })
              }
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              placeholder="Tax Identification Number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={e =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 min-h-[100px]"
              placeholder="Full physical address"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/parties"
            className="px-6 py-2 border border-zinc-700 text-zinc-400 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            <span>{isPending ? 'Saving...' : 'Save Party'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
