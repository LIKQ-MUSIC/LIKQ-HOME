'use client'

import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { CheckCircle } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/ui/Select'

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
    <div className="flex flex-col gap-3 bg-success/5 border border-success/30 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-success">Sign Contract</h3>

      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          Select Your Role
        </label>
        <Select
          value={selectedRole}
          onValueChange={value => setSelectedRole(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            {CONTRACT_ROLES.map(role => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
