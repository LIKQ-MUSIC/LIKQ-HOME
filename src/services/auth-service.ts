import { apiClient } from '@/lib/api-client'

import { createClient } from '@/utils/supabase/server'

export async function getUserRole(email: string) {
  try {
    const supabase = await createClient()
    const {
      data: { session }
    } = await supabase.auth.getSession()
    const token = session?.access_token

    // If no session, can't get protected info locally if we are strict.
    // But getUserRole is called from server component, so token should exist if logged in.

    const response = await apiClient.get<{
      success: boolean
      role: string | null
      permissions: string[]
    }>(`/users/${email}/role`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return {
      role: response.data.role,
      permissions: response.data.permissions || []
    }
  } catch (error) {
    console.error('Failed to fetch user role:', error)
    return { role: null, permissions: [] }
  }
}
