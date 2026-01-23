'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateWorks(id?: string) {
  revalidatePath('/works')
  revalidatePath('/')
  revalidatePath('/works')
  if (id) {
    revalidatePath(`/works/${id}`)
  }
}
