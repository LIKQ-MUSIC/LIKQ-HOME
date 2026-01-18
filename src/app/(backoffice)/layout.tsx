import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/services/auth-service'
import Link from 'next/link'
import { logout } from '@/actions/auth'
import {
  LogOut,
  LayoutDashboard,
  Settings,
  User,
  Briefcase,
  Image
} from 'lucide-react'

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
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-zinc-950 text-white">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p className="text-zinc-400">
          You do not have permission to view the backoffice.
        </p>
        <form action={logout}>
          <button
            type="submit"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Sign out
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Backoffice
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/products"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-package"
            >
              <path d="m7.5 4.27 9 5.15" />
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22v-9" />
            </svg>
            <span>Products</span>
          </Link>

          <Link
            href="/orders"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shopping-cart"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span>Orders</span>
          </Link>

          <div className="mt-8 text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-3">
            Content Management
          </div>

          <Link
            href="/dashboard/cms/work"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <Briefcase size={20} />
            <span>Works</span>
          </Link>

          <Link
            href="/dashboard/cms/aboutus"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <Image size={20} />
            <span>About Us</span>
          </Link>

          <div className="mt-8 text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-3">
            Document Management
          </div>

          <Link
            href="/dashboard/parties"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Parties</span>
          </Link>

          <Link
            href="/dashboard/quotations"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Quotations</span>
          </Link>

          <Link
            href="/dashboard/contracts"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
            </svg>
            <span>Contracts</span>
          </Link>

          <div className="mt-8 text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-3">
            Settings
          </div>
          <Link
            href="/dashboard/users"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <User size={20} />
            <span>Users</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <Settings size={20} />
            <span>General</span>
          </Link>
        </nav>

        <div className="border-t border-zinc-900 pt-6">
          <div className="flex items-center justify-between px-3 text-sm">
            <div className="flex flex-col">
              <span className="text-white font-medium truncate max-w-[120px]">
                {user.identities?.[0]?.identity_data?.name || user.email}
              </span>
              <span className="text-zinc-500 text-xs truncate max-w-[120px]">
                {role}
              </span>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
