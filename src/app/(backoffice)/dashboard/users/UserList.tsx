'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Button from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Plus, Shield } from 'lucide-react'
import { User, CreateUserDTO } from '@/services/user-service'
import { createUserAction, assignRolesAction } from '@/actions/users'
import { usePagination } from '@/hooks/use-pagination'
import {
  DataTable,
  Column,
  PaginationMeta
} from '@/components/dashboard/DataTable'

interface UsersResponse {
  data: User[]
  meta: PaginationMeta
}

export default function UserList() {
  const queryClient = useQueryClient()
  const { page, limit, nextPage, prevPage } = usePagination()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

  // Create User State
  const [formData, setFormData] = useState<CreateUserDTO>({
    email: '',
    name: '',
    password: '',
    roleId: 2
  })
  const [isPasswordLess, setIsPasswordLess] = useState(false)

  // Assign Role State
  const [selectedRole, setSelectedRole] = useState(2)

  const {
    data: response,
    isLoading,
    isError
  } = useQuery<UsersResponse>({
    queryKey: ['users', page, limit],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean } & UsersResponse>(
        `/users?page=${page}&limit=${limit}`
      )
      return { data: res.data.data, meta: res.data.meta }
    }
  })

  interface Role {
    id: number
    name: string
  }

  const { data: rolesResponse } = useQuery<{ success: boolean; data: Role[] }>({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await apiClient.get('/users/roles')
      return res.data
    }
  })

  const roles = rolesResponse?.data || []

  const users = response?.data || []
  const meta = response?.meta

  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserDTO) => {
      // Remove password if isPasswordLess is checked
      const payload = {
        ...data,
        password: isPasswordLess ? undefined : data.password
      }

      const result = await createUserAction(payload)
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsCreateModalOpen(false)
      setFormData({
        email: '',
        name: '',
        password: '',
        roleId: 2
      })
      setIsPasswordLess(false)
    },
    onError: (error: Error) => {
      alert('Failed to create user: ' + error.message)
    }
  })

  const assignRoleMutation = useMutation({
    mutationFn: async () => {
      const result = await assignRolesAction(selectedUserIds, selectedRole)
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsRoleModalOpen(false)
      setSelectedUserIds([])
    },
    onError: (error: Error) => {
      alert('Failed to assign roles: ' + error.message)
    }
  })

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    createUserMutation.mutate(formData)
  }

  const handleAssignRole = async () => {
    if (selectedUserIds.length === 0) return
    assignRoleMutation.mutate()
  }

  const columns: Column<User>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      className: 'text-heading font-medium'
    },
    {
      header: 'Email',
      accessorKey: 'email',
      className: 'text-muted'
    },
    {
      header: 'Roles',
      cell: item => (
        <div className="flex gap-1 flex-wrap">
          {item.roles.map(role => (
            <span
              key={role.id}
              className="px-2 py-0.5 rounded-full text-xs font-medium badge-info border border-primary/20"
            >
              {role.name}
            </span>
          ))}
        </div>
      )
    }
  ]

  const headerActions = (
    <>
      {selectedUserIds.length > 0 && (
        <Button
          onClick={() => setIsRoleModalOpen(true)}
          variant="secondary"
          size="md"
          className="!rounded-lg gap-2"
        >
          <Shield size={20} />
          Assign Role ({selectedUserIds.length})
        </Button>
      )}
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        size="md"
        className="!rounded-lg gap-2"
      >
        <Plus size={20} />
        Create User
      </Button>
    </>
  )

  return (
    <>
      <DataTable
        data={users}
        columns={columns}
        keyExtractor={item => item.id}
        isLoading={isLoading}
        error={isError}
        emptyMessage="No users found."
        errorMessage="Failed to load users"
        title="Manage Users"
        headerActions={headerActions}
        pagination={meta}
        currentPage={page}
        onNextPage={nextPage}
        onPrevPage={prevPage}
        selectable
        selectedIds={selectedUserIds}
        onSelectionChange={setSelectedUserIds}
      />

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Create User
            </h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Name
                </label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>

              <div className="flex items-center space-x-3 py-2">
                <input
                  type="checkbox"
                  id="no-password"
                  checked={isPasswordLess}
                  onChange={e => setIsPasswordLess(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                />
                <label
                  htmlFor="no-password"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer select-none"
                >
                  Create without password (User will set it later)
                </label>
              </div>

              {!isPasswordLess && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Password
                  </label>
                  <Input
                    type="password"
                    required={!isPasswordLess}
                    value={formData.password}
                    onChange={e =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Role
                </label>
                <select
                  value={formData.roleId}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      roleId: Number(e.target.value)
                    })
                  }
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-indigo-500"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Assign Role
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Select Role
                </label>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(Number(e.target.value))}
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-indigo-500"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsRoleModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignRole}
                  disabled={assignRoleMutation.isPending}
                >
                  {assignRoleMutation.isPending ? 'Assigning...' : 'Assign'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
