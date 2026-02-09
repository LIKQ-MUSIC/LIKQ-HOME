'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Button from '@/ui/Button'
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
        <div className="modal-overlay">
          <div className="modal-content max-w-md">
            <h2 className="text-xl font-bold text-heading">Create User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">
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
                  className="input-base"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="!rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  disabled={createUserMutation.isPending}
                  size="md"
                  className="!rounded-lg"
                >
                  {createUserMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {isRoleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-sm">
            <h2 className="text-xl font-bold text-heading">Assign Role</h2>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(Number(e.target.value))}
                className="input-base"
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setIsRoleModalOpen(false)}
                className="!rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignRole}
                disabled={assignRoleMutation.isPending}
                size="md"
                className="!rounded-lg"
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
