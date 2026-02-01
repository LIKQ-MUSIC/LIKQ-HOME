'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Button from '@/ui/Button'
import { Plus, Shield, Loader2 } from 'lucide-react'
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
  const [formData, setFormData] = useState<CreateUserDTO>({
    email: '',
    name: '',
    password: '',
    roleId: 2
  })
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

  const users = response?.data || []
  const meta = response?.meta

  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserDTO) => {
      const result = await createUserAction(data)
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
      className: 'text-white font-medium'
    },
    {
      header: 'Email',
      accessorKey: 'email',
      className: 'text-zinc-400'
    },
    {
      header: 'Roles',
      cell: item => (
        <div className="flex gap-1 flex-wrap">
          {item.roles.map(role => (
            <span
              key={role.id}
              className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
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
        >
          <Shield className="mr-2 h-4 w-4" />
          Assign Role ({selectedUserIds.length})
        </Button>
      )}
      <Button onClick={() => setIsCreateModalOpen(true)} size="md">
        <Plus className="mr-2 h-4 w-4" />
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
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Create User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Role
                </label>
                <select
                  value={formData.roleId}
                  onChange={e =>
                    setFormData({ ...formData, roleId: Number(e.target.value) })
                  }
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>Admin</option>
                  <option value={2}>General User</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <Button disabled={createUserMutation.isPending} size="md">
                  {createUserMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Assign Role</h2>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(Number(e.target.value))}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={1}>Admin</option>
                <option value={2}>General User</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(false)}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <Button
                onClick={handleAssignRole}
                disabled={assignRoleMutation.isPending}
                size="md"
              >
                {assignRoleMutation.isPending ? 'Assigning...' : 'Assign'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
