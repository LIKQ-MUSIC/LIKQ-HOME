'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateBlogs(slug?: string) {
  revalidatePath('/')
  revalidatePath('/blogs')
  if (slug) {
    revalidatePath(`/blogs/${slug}`)
  }
}
