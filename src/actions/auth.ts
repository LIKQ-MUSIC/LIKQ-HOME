'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { apiClient } from '@/lib/api-client'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Type-casting here for convenience
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string
  }

  const { error, data: authData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password
  })

  if (error) {
    return { error: error.message }
  }

  if (authData.user && authData.session) {
    // Create user in our DB
    try {
      await apiClient.post(
        '/users',
        {
          email: data.email,
          name: data.name
        },
        {
          headers: {
            Authorization: `Bearer ${authData.session.access_token}`
          }
        }
      )
    } catch (dbError) {
      console.error('Failed to create user in DB:', dbError)
      // We might want to rollback auth here, but that's complex without admin api.
      // For now, return error.
      return { error: 'Failed to create application user record.' }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/backoffice/dashboard')
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    // redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
