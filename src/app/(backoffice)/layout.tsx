import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/services/auth-service'
import { logout } from '@/actions/auth'
import { Suspense } from 'react'
import DashboardLoading from './loading'
import Sidebar from '@/components/dashboard/Sidebar'
import { PermissionProvider } from '@/provider/PermissionProvider'

export const runtime = 'edge'

export default async function BackofficeLayout({
  children
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    redirect('/login')
  }

  // RBAC Check
  const { role, permissions } = await getUserRole(user.email)

  // Guard: Must have at least one permission
  if (!role || permissions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-page">
        <h1 className="text-2xl font-bold text-danger">Access Denied</h1>
        <p className="text-muted">
          You do not have permission to view the backoffice.
        </p>
        <form action={logout}>
          <button
            type="submit"
            className="text-primary hover:text-primary-hover"
          >
            Sign out
          </button>
        </form>
      </div>
    )
  }

  const userName = user.identities?.[0]?.identity_data?.name as string | undefined

  return (
    <div className="min-h-screen bg-page lg:flex lg:h-screen lg:overflow-hidden">
      <Sidebar
        userEmail={user.email}
        userName={userName}
        role={role}
        permissions={permissions}
        logoutAction={logout}
      />

      {/* Main Content */}
      <PermissionProvider permissions={permissions}>
        <Suspense fallback={<DashboardLoading />}>
          <main className="flex-1 overflow-y-auto bg-page p-4 lg:p-8">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </Suspense>
      </PermissionProvider>
    </div>
  )
}
