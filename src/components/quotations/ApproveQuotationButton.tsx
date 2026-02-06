'use client'

import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { CheckCircle } from 'lucide-react'

interface ApproveQuotationButtonProps {
  quotationId: string
  currentStatus: string
  onSuccess?: () => void
}

export default function ApproveQuotationButton({
  quotationId,
  currentStatus,
  onSuccess
}: ApproveQuotationButtonProps) {
  const queryClient = useQueryClient()
  const [applySignature, setApplySignature] = useState(false)

  // Fetch user profile to get signature
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiClient.get('/users/me')
      return res.data.data || res.data
    }
  })

  const { mutate: approve, isPending } = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/quotations/${quotationId}/approve`, {
        apply_signature: applySignature,
        signature_url: applySignature ? profile?.signature_url : undefined
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      queryClient.invalidateQueries({ queryKey: ['quotation', quotationId] })
      onSuccess?.()
    }
  })

  // Don't show if already approved
  if (currentStatus?.toUpperCase() === 'APPROVED') {
    return null
  }

  return (
    <div className="flex flex-col gap-3 bg-success/5 border border-success/30 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-success">Approval Actions</h3>

      {profile?.signature_url && (
        <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
          <input
            type="checkbox"
            checked={applySignature}
            onChange={e => setApplySignature(e.target.checked)}
            className="w-4 h-4 rounded border-[#e0e4ea] bg-white text-primary focus:ring-primary"
          />
          <span>ลงลายเซ็น (Apply Digital Signature)</span>
        </label>
      )}

      <button
        onClick={() => approve()}
        disabled={isPending}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CheckCircle size={18} />
        {isPending ? 'Approving...' : 'Approve Quotation'}
      </button>

      {!profile?.signature_url && (
        <p className="text-xs text-yellow-400">
          ⚠️ You haven't set up a digital signature yet. Go to Profile to create
          one.
        </p>
      )}
    </div>
  )
}
