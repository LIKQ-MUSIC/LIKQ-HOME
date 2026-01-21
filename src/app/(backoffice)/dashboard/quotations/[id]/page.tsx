'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, X, Loader2, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { revalidateQuotations } from '../actions'
import {
  quotationFormSchema,
  type QuotationFormData,
  type QuotationItem
} from '../schema'
import { ZodError } from 'zod'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const STATUS_OPTIONS = [
  'Draft',
  'Sent',
  'Accepted',
  'Rejected',
  'Expired',
  'Cancelled'
] as const

// Sortable Item Component
interface SortableItemProps {
  id: number
  item: QuotationItem
  index: number
  isViewMode: boolean
  fieldErrors: Record<string, string | undefined>
  updateItem: (index: number, field: keyof QuotationItem, value: string | number) => void
  removeItem: (index: number) => void
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string | undefined>>>
  itemsLength: number
}

function SortableItem({
  id,
  item,
  index,
  isViewMode,
  fieldErrors,
  updateItem,
  removeItem,
  setFieldErrors,
  itemsLength
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-12 gap-4 p-4 bg-zinc-950 rounded-lg border border-zinc-800"
    >
      {!isViewMode && (
        <div
          className="col-span-1 flex items-center justify-center cursor-grab active:cursor-grabbing self-center"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-zinc-400 hover:text-zinc-300" />
        </div>
      )}
      <div className={isViewMode ? 'col-span-12 md:col-span-5' : 'col-span-11 md:col-span-4'}>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Description
        </label>
        <input
          type="text"
          value={item.description}
          onChange={e => {
            updateItem(index, 'description', e.target.value)
            const errorKey = `items.${index}.description`
            if (fieldErrors[errorKey]) {
              setFieldErrors(prev => {
                const next = { ...prev }
                delete next[errorKey]
                return next
              })
            }
          }}
          className={`w-full px-4 py-2 bg-zinc-900 border rounded-lg text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            fieldErrors[`items.${index}.description`]
              ? 'border-red-500'
              : 'border-zinc-700'
          }`}
          placeholder="Service description"
          disabled={isViewMode}
        />
        {fieldErrors[`items.${index}.description`] && (
          <p className="mt-1 text-sm text-red-400">
            {fieldErrors[`items.${index}.description`]}
          </p>
        )}
      </div>
      <div className="col-span-6 md:col-span-2">
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Quantity
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={item.quantity}
          onChange={e => {
            updateItem(
              index,
              'quantity',
              parseFloat(e.target.value) || 0
            )
            const errorKey = `items.${index}.quantity`
            if (fieldErrors[errorKey]) {
              setFieldErrors(prev => {
                const next = { ...prev }
                delete next[errorKey]
                return next
              })
            }
          }}
          className={`w-full px-4 py-2 bg-zinc-900 border rounded-lg text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            fieldErrors[`items.${index}.quantity`]
              ? 'border-red-500'
              : 'border-zinc-700'
          }`}
          disabled={isViewMode}
        />
        {fieldErrors[`items.${index}.quantity`] && (
          <p className="mt-1 text-sm text-red-400">
            {fieldErrors[`items.${index}.quantity`]}
          </p>
        )}
      </div>
      <div className="col-span-6 md:col-span-3">
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Price
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={item.price}
          onChange={e => {
            updateItem(
              index,
              'price',
              parseFloat(e.target.value) || 0
            )
            const errorKey = `items.${index}.price`
            if (fieldErrors[errorKey]) {
              setFieldErrors(prev => {
                const next = { ...prev }
                delete next[errorKey]
                return next
              })
            }
          }}
          className={`w-full px-4 py-2 bg-zinc-900 border rounded-lg text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            fieldErrors[`items.${index}.price`]
              ? 'border-red-500'
              : 'border-zinc-700'
          }`}
          disabled={isViewMode}
        />
        {fieldErrors[`items.${index}.price`] && (
          <p className="mt-1 text-sm text-red-400">
            {fieldErrors[`items.${index}.price`]}
          </p>
        )}
      </div>
      <div className="col-span-12 md:col-span-2 flex justify-end">
        {!isViewMode && itemsLength > 1 && (
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="p-2 text-red-400 hover:text-red-300 transition-colors"
            title="Remove item"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

export default function QuotationFormPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const isNew = params.id === 'new'

  // Helper function to get default dates for new quotations
  const getDefaultDates = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const validUntil = new Date(today)
    validUntil.setDate(validUntil.getDate() + 30) // 30 days from today
    
    return {
      issued_date: today.toISOString(),
      valid_until_date: validUntil.toISOString()
    }
  }

  const defaultDates = isNew ? getDefaultDates() : { issued_date: '', valid_until_date: '' }

  const [formData, setFormData] = useState<QuotationFormData>({
    quotation_number: '',
    contact_person_id: '',
    bill_to_party_id: '',
    approver_id: '',
    customer_signatory_id: '',
    issued_date: defaultDates.issued_date,
    valid_until_date: defaultDates.valid_until_date,
    approved_date: '',
    accepted_date: '',
    status: 'Draft',
    total_amount: 0,
    currency: 'THB',
    items: [{ description: '', quantity: 1, price: 0 }]
  })
  const [vatRate, setVatRate] = useState<number>(7) // Default 7% VAT (Thailand standard)
  const [error, setError] = useState<string | null>(null)
  const [isViewMode, setIsViewMode] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({})

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Handle drag end to reorder items
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setFormData(prev => {
        const oldIndex = prev.items.findIndex((_, i) => i === Number(active.id))
        const newIndex = prev.items.findIndex((_, i) => i === Number(over.id))

        return {
          ...prev,
          items: arrayMove(prev.items, oldIndex, newIndex)
        }
      })
    }
  }

  // Fetch quotation details if in edit/view mode
  const { data: quotation, isLoading: isLoadingQuotation } = useQuery({
    queryKey: ['quotation', params.id],
    queryFn: async () => {
      const res = await apiClient.get(`/quotations/${params.id}`)
      return res.data.data || res.data
    },
    enabled: !isNew && !!params.id
  })

  // Fetch all parties for dropdowns
  const { data: partiesData } = useQuery({
    queryKey: ['parties', 'all'],
    queryFn: async () => {
      const res = await apiClient.get('/parties?limit=1000') // Get all parties
      return Array.isArray(res.data) ? res.data : res.data.data || []
    }
  })

  // Fetch all users for approver dropdown
  const { data: usersData } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      const res = await apiClient.get('/users?limit=1000') // Get all users
      // Handle paginated response structure: { data: User[], meta: {...} }
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data
      }
      // Handle response with success flag: { success: boolean, data: User[], meta: {...} }
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data
      }
      // Handle direct array response
      if (Array.isArray(res.data)) {
        return res.data
      }
      return []
    }
  })

  const parties = partiesData || []
  const users = usersData || []

  // Helper to normalize GET response data to form format
  const normalizeQuotationData = (quotation: any) => {
    return {
      quotation_number: quotation.quotation_number || '',
      contact_person_id: quotation.contact_person_id || '',
      bill_to_party_id: quotation.bill_to_party_id || '',
      approver_id: quotation.approver_id || '',
      customer_signatory_id: quotation.customer_signatory_id || '',
      issued_date: quotation.issued_date || '',
      valid_until_date: quotation.valid_until_date || '',
      approved_date: quotation.approved_date || '',
      accepted_date: quotation.accepted_date || '',
      status: quotation.status 
        ? quotation.status.charAt(0) + quotation.status.slice(1).toLowerCase() // Convert "DRAFT" to "Draft"
        : 'Draft',
      // Convert total_amount from string (GET response) to number (form format)
      total_amount: typeof quotation.total_amount === 'string' 
        ? parseFloat(quotation.total_amount) || 0 
        : (typeof quotation.total_amount === 'number' ? quotation.total_amount : 0),
      currency: quotation.currency || 'THB',
      // Handle items: null (GET response) or array
      items:
        quotation.items && Array.isArray(quotation.items) && quotation.items.length > 0
          ? quotation.items
          : [{ description: '', quantity: 1, price: 0 }]
    }
  }

  // Update form data when quotation is loaded (normalize GET response format)
  useEffect(() => {
    if (quotation) {
      setFormData(normalizeQuotationData(quotation))
    }
  }, [quotation])

  // Calculate total amount from items
  useEffect(() => {
    const total = formData.items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    )
    setFormData(prev => ({ ...prev, total_amount: total }))
  }, [formData.items])

  // Helper to format payload for CREATE/UPDATE (same format for both)
  const formatQuotationPayload = (data: QuotationFormData) => {
      // Format items array - send null if empty, otherwise send filtered items
      const filteredItems = data.items
        .filter(item => item.description && item.description.trim() !== '')
        .map(item => {
          const quantity = typeof item.quantity === 'string' 
            ? parseFloat(item.quantity) || 0 
            : (typeof item.quantity === 'number' ? item.quantity : 0)
          
          const price = typeof item.price === 'string' 
            ? parseFloat(item.price) || 0 
            : (typeof item.price === 'number' ? item.price : 0)
          
          return {
            price: isNaN(price) ? 0 : price,
            quantity: isNaN(quantity) ? 0 : quantity,
            description: String(item.description || '').trim()
          }
        })

      const payload: any = {
        quotation_number: data.quotation_number,
        status: data.status.toUpperCase(), // Convert to uppercase to match API format (DRAFT, SENT, etc.)
        total_amount: data.total_amount,
        currency: data.currency || 'THB',
        items: filteredItems.length > 0 ? filteredItems : null // Send null if no items (matching API response format)
      }

      // Add optional fields only if they have values (don't send null or empty strings)
      if (data.contact_person_id?.trim()) {
        payload.contact_person_id = data.contact_person_id
      }
      
      if (data.bill_to_party_id?.trim()) {
        payload.bill_to_party_id = data.bill_to_party_id
      }
      
      if (data.approver_id?.trim()) {
        payload.approver_id = data.approver_id
      }
      
      if (data.customer_signatory_id?.trim()) {
        payload.customer_signatory_id = data.customer_signatory_id
      }
      // Helper to format date as ISO string at midnight UTC (matching API docs format)
      const formatDateForAPI = (dateString: string): string | null => {
        if (!dateString || !dateString.trim()) return null
        
        try {
          let dateOnly: string
          
          // If it's already an ISO string, extract the date part
          if (dateString.includes('T')) {
            dateOnly = dateString.split('T')[0]
          } else {
            // If it's just a date string (YYYY-MM-DD)
            dateOnly = dateString
          }
          
          // Validate date format (YYYY-MM-DD)
          if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
            return null
          }
          
          // Return as ISO string at midnight UTC (format: 2024-01-18T00:00:00Z)
          return `${dateOnly}T00:00:00Z`
        } catch {
          return null
        }
      }

      const issuedDate = formatDateForAPI(data.issued_date || '')
      if (issuedDate) payload.issued_date = issuedDate
      
      const validUntilDate = formatDateForAPI(data.valid_until_date || '')
      if (validUntilDate) payload.valid_until_date = validUntilDate
      
      const approvedDate = formatDateForAPI(data.approved_date || '')
      if (approvedDate) payload.approved_date = approvedDate
      
      const acceptedDate = formatDateForAPI(data.accepted_date || '')
      if (acceptedDate) payload.accepted_date = acceptedDate

      // Convert total_amount to string to match API format (both CREATE and UPDATE use same format)
      payload.total_amount = String(payload.total_amount || 0)

      return payload
  }

  // Create/Update mutation (uses same payload format for both)
  const { mutate: saveQuotation, isPending } = useMutation({
    mutationFn: async (data: QuotationFormData) => {
      // Use same payload format for both CREATE and UPDATE
      const payload = formatQuotationPayload(data)

      // Log payload for debugging (remove in production)
      console.log('Quotation payload:', JSON.stringify(payload, null, 2))

      if (isNew) {
        await apiClient.post('/quotations', payload)
      } else {
        await apiClient.put(`/quotations/${params.id}`, payload)
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      await revalidateQuotations()
      router.push('/dashboard/quotations')
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to save quotation'
      )
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    try {
      // Validate with Zod
      const validatedData = quotationFormSchema.parse(formData)
      saveQuotation(validatedData)
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {}
        err.issues.forEach(issue => {
          const path = issue.path.join('.')
          errors[path] = issue.message
        })
        setFieldErrors(errors)
        
        // Set general error message
        const firstIssue = err.issues[0]
        if (firstIssue) {
          setError(`Validation error: ${firstIssue.message}`)
        }
      } else {
        setError('An unexpected error occurred')
      }
    }
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }))
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateItem = (
    index: number,
    field: keyof QuotationItem,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  if (!isNew && isLoadingQuotation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/quotations"
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isNew
                ? 'New Quotation'
                : isViewMode
                  ? 'View Quotation'
                  : 'Edit Quotation'}
            </h1>
            <p className="text-zinc-400 mt-1">
              {isNew
                ? 'Create a new quotation'
                : isViewMode
                  ? 'View quotation details'
                  : 'Update quotation details'}
            </p>
          </div>
        </div>
        {!isNew && !isViewMode && (
          <button
            onClick={() => setIsViewMode(true)}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            View Mode
          </button>
        )}
        {isViewMode && (
          <button
            onClick={() => setIsViewMode(false)}
            className="px-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Edit Mode
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 max-w-4xl mx-auto">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        {/* Step 1: Basic Information */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-sm">
              1
            </div>
            <h2 className="text-xl font-semibold text-white">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Quotation Number *
              </label>
              <input
                type="text"
                value={formData.quotation_number}
                onChange={e => {
                  setFormData({
                    ...formData,
                    quotation_number: e.target.value
                  })
                  // Clear error when user starts typing
                  if (fieldErrors.quotation_number) {
                    setFieldErrors(prev => {
                      const next = { ...prev }
                      delete next.quotation_number
                      return next
                    })
                  }
                }}
                className={`w-full px-4 py-2 bg-zinc-950 border rounded-lg text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  fieldErrors.quotation_number
                    ? 'border-red-500'
                    : 'border-zinc-700'
                }`}
                placeholder="e.g. Q-2024-001"
                required
                disabled={isViewMode}
              />
              {fieldErrors.quotation_number && (
                <p className="mt-1 text-sm text-red-400">
                  {fieldErrors.quotation_number}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={e => {
                  const value = e.target.value
                  if (STATUS_OPTIONS.includes(value as typeof STATUS_OPTIONS[number])) {
                    setFormData({
                      ...formData,
                      status: value as QuotationFormData['status']
                    })
                  }
                }}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isViewMode}
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Currency
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={e => {
                  setFormData({ ...formData, currency: e.target.value })
                  if (fieldErrors.currency) {
                    setFieldErrors(prev => {
                      const next = { ...prev }
                      delete next.currency
                      return next
                    })
                  }
                }}
                className={`w-full px-4 py-2 bg-zinc-950 border rounded-lg text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  fieldErrors.currency ? 'border-red-500' : 'border-zinc-700'
                }`}
                placeholder="THB"
                disabled={true}
              />
              {fieldErrors.currency && (
                <p className="mt-1 text-sm text-red-400">
                  {fieldErrors.currency}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                VAT Rate (%)
              </label>
              <input
                type="number"
                min="7"
                max="100"
                step="1"
                value={vatRate}
                onChange={e => {
                  const value = parseFloat(e.target.value)
                  if (value >= 7 && value <= 100) {
                    setVatRate(value)
                  }
                }}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="7"
                disabled={isViewMode}
              />
              <p className="text-xs text-zinc-500 mt-1">
                Value Added Tax percentage
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Party & User References */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-sm">
              2
            </div>
            <h2 className="text-xl font-semibold text-white">
              Party & User References
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Contact Person
              </label>
              <Select
                value={formData.contact_person_id ? formData.contact_person_id : 'none'}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    contact_person_id: value === 'none' ? '' : value
                  })
                  if (fieldErrors.contact_person_id) {
                    setFieldErrors(prev => {
                      const next = { ...prev }
                      delete next.contact_person_id
                      return next
                    })
                  }
                }}
                disabled={isViewMode}
                key={`contact-person-${parties.length}-${formData.contact_person_id || 'none'}`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select contact person" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {parties.map((party: any) => (
                    <SelectItem key={party.id} value={party.id}>
                      {party.display_name || party.legal_name} ({party.party_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.contact_person_id && (
                <p className="mt-1 text-sm text-red-400">
                  {fieldErrors.contact_person_id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Bill To Party
              </label>
              <Select
                value={formData.bill_to_party_id ? formData.bill_to_party_id : 'none'}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    bill_to_party_id: value === 'none' ? '' : value
                  })
                  if (fieldErrors.bill_to_party_id) {
                    setFieldErrors(prev => {
                      const next = { ...prev }
                      delete next.bill_to_party_id
                      return next
                    })
                  }
                }}
                disabled={isViewMode}
                key={`bill-to-party-${parties.length}-${formData.bill_to_party_id || 'none'}`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select bill to party" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {parties.map((party: any) => (
                    <SelectItem key={party.id} value={party.id}>
                      {party.display_name || party.legal_name} ({party.party_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.bill_to_party_id && (
                <p className="mt-1 text-sm text-red-400">
                  {fieldErrors.bill_to_party_id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Approver
              </label>
              <Select
                value={formData.approver_id ? formData.approver_id : 'none'}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    approver_id: value === 'none' ? '' : value
                  })
                  if (fieldErrors.approver_id) {
                    setFieldErrors(prev => {
                      const next = { ...prev }
                      delete next.approver_id
                      return next
                    })
                  }
                }}
                disabled={isViewMode}
                key={`approver-${users.length}-${parties.length}-${formData.approver_id || 'none'}`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select approver (User or Party)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {users.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>👤 Users</SelectLabel>
                      {users.map((user: any) => (
                        <SelectItem key={`user_${user.id}`} value={user.id}>
                          {user.name || user.email} {user.email ? `(${user.email})` : ''}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                  {parties.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>🏢 Parties</SelectLabel>
                      {parties.map((party: any) => (
                        <SelectItem key={`party_${party.id}`} value={party.id}>
                          {party.display_name || party.legal_name} ({party.party_type})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
              {fieldErrors.approver_id && (
                <p className="mt-1 text-sm text-red-400">
                  {fieldErrors.approver_id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Customer Signatory
              </label>
              <Select
                value={formData.customer_signatory_id ? formData.customer_signatory_id : 'none'}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    customer_signatory_id: value === 'none' ? '' : value
                  })
                  if (fieldErrors.customer_signatory_id) {
                    setFieldErrors(prev => {
                      const next = { ...prev }
                      delete next.customer_signatory_id
                      return next
                    })
                  }
                }}
                disabled={isViewMode}
                key={`customer-signatory-${parties.length}-${formData.customer_signatory_id || 'none'}`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select customer signatory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {parties.map((party: any) => (
                    <SelectItem key={party.id} value={party.id}>
                      {party.display_name || party.legal_name} ({party.party_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.customer_signatory_id && (
                <p className="mt-1 text-sm text-red-400">
                  {fieldErrors.customer_signatory_id}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Dates */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-sm">
              3
            </div>
            <h2 className="text-xl font-semibold text-white">Dates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Issued Date
              </label>
              <input
                type="date"
                value={
                  formData.issued_date
                    ? new Date(formData.issued_date).toISOString().split('T')[0]
                    : ''
                }
                onChange={e => {
                  const dateValue = e.target.value
                  setFormData({
                    ...formData,
                    issued_date: dateValue ? new Date(dateValue).toISOString() : ''
                  })
                  if (fieldErrors.issued_date) {
                    setFieldErrors(prev => {
                      const next = { ...prev }
                      delete next.issued_date
                      return next
                    })
                  }
                }}
                className={`w-full px-4 py-2 bg-zinc-950 border rounded-lg text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert ${
                  fieldErrors.issued_date ? 'border-red-500' : 'border-zinc-700'
                }`}
                disabled={isViewMode}
              />
              {fieldErrors.issued_date && (
                <p className="mt-1 text-sm text-red-400">
                  {fieldErrors.issued_date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Valid Until Date
              </label>
              <input
                type="date"
                value={
                  formData.valid_until_date
                    ? new Date(formData.valid_until_date).toISOString().split('T')[0]
                    : ''
                }
                onChange={e => {
                  const dateValue = e.target.value
                  setFormData({
                    ...formData,
                    valid_until_date: dateValue ? new Date(dateValue).toISOString() : ''
                  })
                  if (fieldErrors.valid_until_date) {
                    setFieldErrors(prev => {
                      const next = { ...prev }
                      delete next.valid_until_date
                      return next
                    })
                  }
                }}
                className={`w-full px-4 py-2 bg-zinc-950 border rounded-lg text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert ${
                  fieldErrors.valid_until_date ? 'border-red-500' : 'border-zinc-700'
                }`}
                disabled={isViewMode}
              />
              {fieldErrors.valid_until_date && (
                <p className="mt-1 text-sm text-red-400">
                  {fieldErrors.valid_until_date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Approved Date
              </label>
              <input
                type="date"
                value={
                  formData.approved_date
                    ? new Date(formData.approved_date).toISOString().split('T')[0]
                    : ''
                }
                onChange={e => {
                  const dateValue = e.target.value
                  setFormData({
                    ...formData,
                    approved_date: dateValue ? new Date(dateValue).toISOString() : ''
                  })
                  if (fieldErrors.approved_date) {
                    setFieldErrors(prev => {
                      const next = { ...prev }
                      delete next.approved_date
                      return next
                    })
                  }
                }}
                className={`w-full px-4 py-2 bg-zinc-950 border rounded-lg text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert ${
                  fieldErrors.approved_date ? 'border-red-500' : 'border-zinc-700'
                }`}
                disabled={isViewMode}
              />
              {fieldErrors.approved_date && (
                <p className="mt-1 text-sm text-red-400">
                  {fieldErrors.approved_date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Accepted Date
              </label>
              <input
                type="date"
                value={
                  formData.accepted_date
                    ? new Date(formData.accepted_date).toISOString().split('T')[0]
                    : ''
                }
                onChange={e => {
                  const dateValue = e.target.value
                  setFormData({
                    ...formData,
                    accepted_date: dateValue ? new Date(dateValue).toISOString() : ''
                  })
                  if (fieldErrors.accepted_date) {
                    setFieldErrors(prev => {
                      const next = { ...prev }
                      delete next.accepted_date
                      return next
                    })
                  }
                }}
                className={`w-full px-4 py-2 bg-zinc-950 border rounded-lg text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert ${
                  fieldErrors.accepted_date ? 'border-red-500' : 'border-zinc-700'
                }`}
                disabled={isViewMode}
              />
              {fieldErrors.accepted_date && (
                <p className="mt-1 text-sm text-red-400">
                  {fieldErrors.accepted_date}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Step 4: Line Items */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-sm">
                4
              </div>
              <h2 className="text-xl font-semibold text-white">Line Items</h2>
            </div>
            {!isViewMode && (
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"
              >
                <Plus size={16} />
                Add Item
              </button>
            )}
          </div>

          {fieldErrors.items && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-sm text-red-400">{fieldErrors.items}</p>
            </div>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={formData.items.map((_, index) => index)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <SortableItem
                    key={index}
                    id={index}
                    item={item}
                    index={index}
                    isViewMode={isViewMode}
                    fieldErrors={fieldErrors}
                    updateItem={updateItem}
                    removeItem={removeItem}
                    setFieldErrors={setFieldErrors}
                    itemsLength={formData.items.length}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Summary Section */}
          <div className="mt-6 pt-6 border-t border-zinc-800 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Subtotal</span>
              <span className="text-zinc-300 font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: formData.currency || 'THB',
                  minimumFractionDigits: 2
                }).format(formData.total_amount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">
                VAT ({vatRate}%)
              </span>
              <span className="text-zinc-300 font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: formData.currency || 'THB',
                  minimumFractionDigits: 2
                }).format((formData.total_amount * vatRate) / 100)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
              <div>
                <p className="text-sm text-zinc-400">Currency</p>
                <p className="text-lg font-semibold text-white mt-1">
                  {formData.currency || 'THB'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-400">Total Amount</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: formData.currency || 'THB',
                    minimumFractionDigits: 2
                  }).format(formData.total_amount + (formData.total_amount * vatRate) / 100)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!isViewMode && (
          <div className="flex justify-end gap-3">
            <Link
              href="/dashboard/quotations"
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
              <span>
                {isPending
                  ? 'Saving...'
                  : isNew
                    ? 'Create Quotation'
                    : 'Update Quotation'}
              </span>
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
