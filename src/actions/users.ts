'use server'

import { revalidatePath } from 'next/cache'
import {
  createUser,
  assignRolesBatch,
  CreateUserDTO
} from '@/services/user-service'

export async function createUserAction(dto: CreateUserDTO) {
  try {
    await createUser(dto)
    revalidatePath('/dashboard/users')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function assignRolesAction(userIds: string[], roleId: number) {
  try {
    await assignRolesBatch(userIds, roleId)
    revalidatePath('/dashboard/users')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
