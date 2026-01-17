'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { ArrowLeft, Save, PlusCircle, X, Download } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import PDFExportButton, { ContractPDF } from '@/components/contracts/PDFExport'
import { pdf } from '@react-pdf/renderer'

// Dynamic import to avoid SSR issues with TipTap
const TipTapEditor = dynamic(
  () => import('@/components/contracts/TipTapEditor'),
  {
    ssr: false,
    loading: () => <div className="p-4 text-zinc-400">Loading editor...</div>
  }
)

interface Party {
  id: string
  legal_name: string
  display_name?: string | null
}

interface ContractParty {
  party_id: string
  role: string
  sign_label?: string
}

interface ContractFormData {
  contract_number?: string
  origin: 'Internal' | 'External'
  title: string
  current_status: 'Draft' | 'Active' | 'Expired' | 'Terminated'
  content: string
  parties: ContractParty[]
}

interface ContractDetail {
  id: string
  contract_number: string
  origin: 'Internal' | 'External'
  title: string
  current_status: 'Draft' | 'Active' | 'Expired' | 'Terminated'
  parties?: Array<{
    id: string
    legal_name: string
    display_name?: string
    role: string
    sign_label?: string
  }>
  latest_version?: {
    content_text: string
  }
}

interface ContractVersion {
  id: string
  version_number: number
  content_text: string
  created_at: string
  is_final: boolean
  file_url?: string
}

export default function ContractFormPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const isNew = !params.id || params.id === 'new'

  const [formData, setFormData] = useState<ContractFormData>({
    contract_number: '',
    origin: 'Internal',
    title: '',
    current_status: 'Draft',
    content: '',
    parties: []
  })
  const [newParty, setNewParty] = useState<ContractParty>({
    party_id: '',
    role: '',
    sign_label: ''
  })
  const [error, setError] = useState<string | null>(null)

  // Fetch available parties
  const { data: availableParties = [] } = useQuery({
    queryKey: ['parties'],
    queryFn: async () => {
      const res = await apiClient.get('/parties')
      return res.data as Party[]
    }
  })

  // Fetch contract versions
  const { data: versions = [] } = useQuery({
    queryKey: ['contract-versions', params.id],
    queryFn: async () => {
      const res = await apiClient.get(`/contracts/${params.id}/versions`)
      return res.data as ContractVersion[]
    },
    enabled: !isNew
  })

  const loadVersion = (version: ContractVersion) => {
    if (
      confirm(
        `Load Version ${version.version_number}? This will replace current content.`
      )
    ) {
      setFormData(prev => ({ ...prev, content: version.content_text }))
    }
  }

  // Fetch contract details (for edit mode)
  const { data: contractDetail } = useQuery({
    queryKey: ['contracts', params.id],
    queryFn: async () => {
      const res = await apiClient.get(`/contracts/${params.id}`)
      return res.data as ContractDetail
    },
    enabled: !isNew
  })

  // Update form data when contract detail is loaded
  useEffect(() => {
    if (contractDetail) {
      setFormData({
        contract_number: contractDetail.contract_number,
        origin: contractDetail.origin,
        title: contractDetail.title,
        current_status: contractDetail.current_status,
        content: contractDetail.latest_version?.content_text || '',
        parties:
          contractDetail.parties?.map((p: any) => ({
            party_id: p.id,
            role: p.role,
            sign_label: p.sign_label // Map from backend
          })) || []
      })
    }
  }, [contractDetail])

  // Helper to get full party object
  const getParty = (partyId: string) =>
    availableParties.find(p => p.id === partyId)

  // Helper to get generic name for display
  const getPartyName = (partyId: string) => {
    const party = getParty(partyId)
    return party?.display_name || party?.legal_name || partyId
  }

  // Helper to generate and upload PDF
  const generateAndUploadPDF = async (data: any, contractNum: string) => {
    const pdfContract = {
      contract_number: contractNum,
      title: data.title,
      origin: data.origin,
      current_status: data.current_status,
      parties:
        data.parties?.map((p: any) => {
          const partyObj = getParty(p.party_id)
          return {
            legal_name: partyObj?.legal_name || p.party_id,
            display_name: partyObj?.display_name || undefined,
            role: p.role,
            sign_label: p.sign_label
          }
        }) || [],
      latest_version: {
        content_text: data.content || ''
      }
    }

    const blob = await pdf(<ContractPDF contract={pdfContract} />).toBlob()
    const formData = new FormData()
    formData.append('file', blob, `contract-${contractNum}.pdf`)
    formData.append('folder', 'contracts')

    const uploadRes = await apiClient.post('/storage/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return uploadRes.data.url
  }

  // Create/Update contract mutation
  const { mutate: saveContract, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      // 1. If NEW, generate PDF with placeholder first (or handle post-creation)
      let fileUrl = ''
      const isFinal = payload.current_status === 'Active'

      if (isNew) {
        try {
          fileUrl = await generateAndUploadPDF(payload, 'PENDING')
        } catch (e) {
          console.error('Failed to generate PDF', e)
        }

        // Create Contract
        const res = await apiClient.post('/contracts', {
          ...payload,
          file_url: fileUrl
        })
        return res.data
      } else {
        // Update contract metadata including parties
        await apiClient.put(`/contracts/${params.id}`, {
          title: payload.title,
          current_status: payload.current_status,
          parties: payload.parties // Ensure backend handles party replacement/update
        })

        try {
          fileUrl = await generateAndUploadPDF(
            payload,
            contractDetail?.contract_number || ''
          )
        } catch (e) {
          console.error('Failed to generate PDF', e)
        }

        // Create new version
        await apiClient.post(`/contracts/${params.id}/versions`, {
          content_text: payload.content,
          is_final: isFinal,
          file_url: fileUrl
        })

        return { success: true }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contract-versions'] })
      router.push('/dashboard/contracts')
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save contract')
    }
  })

  // Add Party Logic
  const addParty = () => {
    if (newParty.party_id) {
      setFormData({
        ...formData,
        parties: [...formData.parties, newParty]
      })
      setNewParty({ party_id: '', role: '', sign_label: '' })
    }
  }

  const removeParty = (index: number) => {
    setFormData({
      ...formData,
      parties: formData.parties.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const payload: any = {
      origin: formData.origin,
      title: formData.title,
      current_status: formData.current_status,
      parties: formData.parties.length > 0 ? formData.parties : undefined,
      content: formData.content || undefined
    }

    saveContract(payload)
  }

  // Live preview data for PDF
  const previewContract = {
    contract_number:
      formData.contract_number || contractDetail?.contract_number || 'DRAFT',
    title: formData.title,
    origin: formData.origin,
    current_status: formData.current_status,
    parties: formData.parties.map(p => {
      const partyObj = getParty(p.party_id)
      return {
        legal_name: partyObj?.legal_name || '...',
        display_name: partyObj?.display_name || undefined,
        role: p.role,
        sign_label: p.sign_label
      }
    }),
    latest_version: {
      content_text: formData.content
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/contracts"
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isNew ? 'Create Contract' : 'Edit Contract'}
            </h1>
            <p className="text-zinc-400 mt-1">
              {isNew ? 'Create a new contract' : 'Update contract details'}
            </p>
          </div>
        </div>

        <PDFExportButton contract={previewContract} />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">
            Basic Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Contract Number *
              </label>
              <input
                type="text"
                value={
                  formData.contract_number || 'Auto-generated (CTR-YYYYMM-XXXX)'
                }
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                disabled
              />
              {isNew && (
                <p className="text-xs text-zinc-500 mt-1">
                  Contract number will be auto-generated in format:
                  CTR-YYYYMM-XXXX
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Origin *
              </label>
              <select
                value={formData.origin}
                onChange={e =>
                  setFormData({
                    ...formData,
                    origin: e.target.value as 'Internal' | 'External'
                  })
                }
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                required
              >
                <option value="Internal">Internal</option>
                <option value="External">External</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Status
            </label>
            <select
              value={formData.current_status}
              onChange={e =>
                setFormData({
                  ...formData,
                  current_status: e.target.value as any
                })
              }
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>

        {/* Parties */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Parties</h2>

          {/* Existing Parties */}
          {formData.parties.length > 0 && (
            <div className="space-y-2">
              {formData.parties.map((party, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">
                      {getPartyName(party.party_id)}
                    </span>
                    {party.sign_label && (
                      <span className="text-zinc-400 text-sm bg-zinc-900 px-2 py-0.5 rounded">
                        {party.sign_label}
                      </span>
                    )}
                    {party.role && (
                      <span className="text-indigo-400 text-sm">
                        {party.role}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeParty(index)}
                    className="p-1 text-zinc-400 hover:text-red-400"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Party */}
          <div className="flex gap-2">
            <select
              value={newParty.party_id}
              onChange={e =>
                setNewParty({ ...newParty, party_id: e.target.value })
              }
              className="flex-1 px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Party</option>
              {availableParties.map(party => (
                <option key={party.id} value={party.id}>
                  {party.display_name || party.legal_name}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={newParty.sign_label || ''}
              onChange={e =>
                setNewParty({ ...newParty, sign_label: e.target.value })
              }
              placeholder="Label (Optional)"
              className="px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 w-48"
            />

            <select
              value={newParty.role}
              onChange={e => setNewParty({ ...newParty, role: e.target.value })}
              className="flex-1 px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Role (Optional)</option>
              <option value="ผู้ว่าจ้าง">ผู้ว่าจ้าง (Employer)</option>
              <option value="ผู้รับจ้าง">ผู้รับจ้าง (Contractor)</option>
              <option value="พยาน 1">พยาน 1 (Witness 1)</option>
              <option value="พยาน 2">พยาน 2 (Witness 2)</option>
            </select>

            <button
              type="button"
              onClick={addParty}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <PlusCircle size={20} />
            </button>
          </div>
        </div>

        {/* Contract Content & Versions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Contract Content
            </h2>
            <TipTapEditor
              content={formData.content}
              onChange={content => setFormData({ ...formData, content })}
            />
          </div>

          {/* Version History Sidebar */}
          {!isNew && (
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4 h-fit">
              <h2 className="text-xl font-semibold text-white">
                Version History
              </h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {versions.length === 0 ? (
                  <p className="text-zinc-500 text-sm">No versions yet.</p>
                ) : (
                  versions.map(version => (
                    <div
                      key={version.id}
                      className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group"
                      onClick={() => loadVersion(version)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-indigo-400 font-medium text-sm">
                          v{version.version_number}
                        </span>
                        {version.is_final && (
                          <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/20">
                            Final
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 mb-2">
                        {new Date(version.created_at).toLocaleString()}
                      </div>

                      {/* Download Button */}
                      {version.file_url && (
                        <a
                          href={version.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors p-1.5 bg-zinc-900 rounded border border-zinc-800 hover:border-zinc-700 w-fit"
                          onClick={e => e.stopPropagation()}
                        >
                          <Download size={12} />
                          Download PDF
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/contracts"
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
            <span>{isPending ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
