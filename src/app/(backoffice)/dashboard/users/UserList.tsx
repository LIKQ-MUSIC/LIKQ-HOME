'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Button from '@/ui/Button'
import { Plus, Shield, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { User, CreateUserDTO } from '@/services/user-service'
import { createUserAction, assignRolesAction } from '@/actions/users'
import { usePagination } from '@/hooks/use-pagination'

interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

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
    roleId: 2 // Default to general_user (assuming 1 is admin)
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

  // We can also wrap the Server Actions in useMutation for better state management
  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserDTO) => {
      // We can call the server action here
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

  const toggleUserSelection = (id: string) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (isError) {
    return <div className="text-red-400 p-8">Failed to load users</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Manage Users
        </h1>
        <div className="flex gap-2">
          {selectedUserIds.length > 0 && (
            <Button
              onClick={() => setIsRoleModalOpen(true)}
              className="bg-zinc-700 hover:bg-zinc-600"
            >
              <Shield className="mr-2 h-4 w-4" />
              Assign Role ({selectedUserIds.length})
            </Button>
          )}
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 font-medium">
                <th className="p-4 w-8">
                  <input
                    type="checkbox"
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedUserIds(users.map(u => u.id))
                      } else {
                        setSelectedUserIds([])
                      }
                    }}
                    checked={
                      users.length > 0 &&
                      selectedUserIds.length === users.length
                    }
                    className="rounded border-gray-600 bg-zinc-800 text-indigo-500 focus:ring-indigo-500"
                  />
                </th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(user => (
                <tr
                  key={user.id}
                  className="hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="rounded border-gray-600 bg-zinc-800 text-indigo-500 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="p-4 text-white font-medium">{user.name}</td>
                  <td className="p-4 text-gray-400">{user.email}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {user.roles.map(role => (
                        <span
                          key={role.id}
                          className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        >
                          {role.name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {meta && (
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">
                Page <span className="font-medium text-white">{meta.page}</span>{' '}
                of{' '}
                <span className="font-medium text-white">
                  {meta.totalPages}
                </span>
              </span>
              <span className="text-sm text-zinc-500">
                ({meta.total} total)
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={prevPage}
                disabled={page <= 1}
                className="px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={nextPage}
                disabled={page >= meta.totalPages}
                className="px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

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
                <Button disabled={createUserMutation.isPending}>
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
              >
                {assignRoleMutation.isPending ? 'Assigning...' : 'Assign'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
