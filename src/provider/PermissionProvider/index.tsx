'use client'

import React, { createContext, useContext } from 'react'

interface PermissionContextType {
  permissions: string[]
}

const PermissionContext = createContext<PermissionContextType>({
  permissions: []
})

export function PermissionProvider({
  permissions,
  children
}: {
  permissions: string[]
  children: React.ReactNode
}) {
  return (
    <PermissionContext.Provider value={{ permissions }}>
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermissions = () => useContext(PermissionContext)
