'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateQuotations(id?: string) {
  revalidatePath('/dashboard/quotations')
  if (id) {
    revalidatePath(`/dashboard/quotations/${id}`)
  }
}
