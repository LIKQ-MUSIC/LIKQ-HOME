import { apiClient } from '@/lib/api-client'
import { createClient } from '@/utils/supabase/server'

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  roles: {
    id: number
    name: string
  }[]
}

export interface CreateUserDTO {
  email: string
  name: string
  password?: string
  roleId: number
}

export async function getAllUsers() {
  const supabase = await createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()
  const token = session?.access_token

  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await apiClient.get<{ success: boolean; data: User[] }>(
    '/users',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data.data
}

export async function createUser(dto: CreateUserDTO) {
  const supabase = await createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()
  const token = session?.access_token

  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await apiClient.post<{ success: boolean; data: User }>(
    '/users/create',
    dto,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data.data
}

export async function assignRolesBatch(userIds: string[], roleId: number) {
  const supabase = await createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()
  const token = session?.access_token

  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await apiClient.post(
    '/users/roles/batch',
    { userIds, roleId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}
