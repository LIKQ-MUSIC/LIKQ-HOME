'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { usePermissions } from '@/provider/PermissionProvider'
import { getPermissionsForRoute, hasPermission } from '@/lib/permissions'

export default function PermissionGate({
  children
}: {
  children: React.ReactNode
}) {
  const { permissions } = usePermissions()
  const router = useRouter()
  const pathname = usePathname()

  const required = getPermissionsForRoute(pathname)
  const allowed = !required || hasPermission(permissions, required)

  useEffect(() => {
    if (!allowed) {
      router.replace('/dashboard/unauthorized')
    }
  }, [allowed, router])

  if (!allowed) return null

  return <>{children}</>
}
