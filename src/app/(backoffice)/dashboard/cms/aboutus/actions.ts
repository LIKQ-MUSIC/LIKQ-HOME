'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateAboutUs() {
  revalidateTag('about-us-images')
}
