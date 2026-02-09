'use client'

import UserList from './UserList'
import PermissionGate from '@/components/dashboard/PermissionGate'

export default function UsersPage() {
  return (
    <PermissionGate>
      <div className="p-8 w-full max-w-7xl mx-auto space-y-8">
        <UserList />
      </div>
    </PermissionGate>
  )
}
