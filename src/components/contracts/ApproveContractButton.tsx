'use client'

import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { CheckCircle } from 'lucide-react'

interface ApproveContractButtonProps {
  contractId: string
  onSuccess?: () => void
}

const CONTRACT_ROLES = [
  { value: 'party_a', label: 'Party A (คู่สัญญา A)' },
  { value: 'party_b', label: 'Party B (คู่สัญญา B)' },
  { value: 'witness_1', label: 'Witness 1 (พยาน 1)' },
  { value: 'witness_2', label: 'Witness 2 (พยาน 2)' }
]

export default function ApproveContractButton({
  contractId,
  onSuccess
}: ApproveContractButtonProps) {
  const queryClient = useQueryClient()
  const [selectedRole, setSelectedRole] = useState<string>('party_a')
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
      await apiClient.post(`/contracts/${contractId}/approve`, {
        role: selectedRole,
        apply_signature: applySignature,
        signature_url: applySignature ? profile?.signature_url : undefined
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contract', contractId] })
      onSuccess?.()
    }
  })

  return (
    <div className="flex flex-col gap-3 bg-green-900/20 border border-green-700 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-green-400">Sign Contract</h3>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Select Your Role
        </label>
        <select
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          {CONTRACT_ROLES.map(role => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>

      {profile?.signature_url && (
        <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={applySignature}
            onChange={e => setApplySignature(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
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
        {isPending ? 'Signing...' : 'Sign Contract'}
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
