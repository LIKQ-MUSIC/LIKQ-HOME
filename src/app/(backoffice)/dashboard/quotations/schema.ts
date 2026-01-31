import { z } from 'zod'

// Schema for a complete/valid quotation item
export const quotationItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseFloat(val) || 0 : val))
    .pipe(z.number().int().min(1, 'Quantity must be at least 1')),
  price: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseFloat(val) || 0 : val))
    .pipe(z.number().min(0, 'Price must be greater than or equal to 0'))
})

// Schema for form items (allows partial items for UI)
const formItemSchema = z.object({
  description: z.string(),
  quantity: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseFloat(val) || 0 : val))
    .pipe(z.number().int().min(0)),
  price: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseFloat(val) || 0 : val))
    .pipe(z.number())
})

export const quotationFormSchema = z.object({
  quotation_number: z.string().trim().optional(),
  contact_person_id: z.string().optional().or(z.literal('')),
  bill_to_party_id: z.string().optional().or(z.literal('')),
  approver_id: z.string().optional().or(z.literal('')),
  customer_signatory_id: z.string().optional().or(z.literal('')),
  issued_date: z.string().optional().or(z.literal('')),
  valid_until_date: z.string().optional().or(z.literal('')),
  approved_date: z.string().optional().or(z.literal('')),
  accepted_date: z.string().optional().or(z.literal('')),
  signature_date: z.string().optional().or(z.literal('')),
  payment_method: z.string().optional().or(z.literal('')),
  authorized_signature_url: z.string().optional().nullable(),
  vat_rate: z.number().min(0).max(100).default(7),
  status: z.enum([
    'Draft',
    'Sent',
    'Approved',
    'Accepted',
    'Rejected',
    'Expired',
    'Cancelled'
  ]),
  total_amount: z
    .number()
    .min(0, 'Total amount must be greater than or equal to 0'),
  currency: z.string().min(1, 'Currency is required').default('THB'),
  items: z
    .array(formItemSchema)
    .min(1, 'At least one line item is required')
    .refine(
      items => {
        // Filter out empty items and validate all described items
        const validItems = items.filter(
          item => item.description && item.description.trim() !== ''
        )
        if (validItems.length === 0) {
          return false
        }
        // Every described item must pass full validation
        return validItems.every(item => {
          try {
            quotationItemSchema.parse(item)
            return true
          } catch {
            return false
          }
        })
      },
      {
        message: 'All described items must have quantity ≥ 1 and price'
      }
    )
})

export type QuotationFormData = z.infer<typeof quotationFormSchema>
export type QuotationItem = z.infer<typeof quotationItemSchema>
