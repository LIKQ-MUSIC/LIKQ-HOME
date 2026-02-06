'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LogOut,
  LayoutDashboard,
  Settings,
  User,
  Briefcase,
  Image as ImageIcon,
  Book,
  Menu,
  X,
  Package,
  ShoppingCart,
  Users,
  FileText,
  ClipboardList
} from 'lucide-react'

interface SidebarProps {
  userEmail: string
  userName?: string
  role: string
  logoutAction: () => Promise<void>
}

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    items: [
      {
        href: '/dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard size={20} />
      },
      { href: '/products', label: 'Products', icon: <Package size={20} /> },
      { href: '/orders', label: 'Orders', icon: <ShoppingCart size={20} /> }
    ]
  },
  {
    title: 'Content Management',
    items: [
      { href: '/dashboard/cms/work', label: 'Works', icon: <Briefcase size={20} /> },
      {
        href: '/dashboard/cms/aboutus',
        label: 'About Us',
        icon: <ImageIcon size={20} />
      }
    ]
  },
  {
    title: 'Document Management',
    items: [
      { href: '/dashboard/api-docs', label: 'API Docs', icon: <Book size={20} /> },
      { href: '/dashboard/parties', label: 'Parties', icon: <Users size={20} /> },
      {
        href: '/dashboard/quotations',
        label: 'Quotations',
        icon: <ClipboardList size={20} />
      },
      {
        href: '/dashboard/contracts',
        label: 'Contracts',
        icon: <FileText size={20} />
      }
    ]
  },
  {
    title: 'Settings',
    items: [
      { href: '/dashboard/users', label: 'Users', icon: <User size={20} /> },
      { href: '/dashboard/profile', label: 'Profile', icon: <User size={20} /> },
      { href: '#', label: 'General', icon: <Settings size={20} /> }
    ]
  }
]

export default function Sidebar({
  userEmail,
  userName,
  role,
  logoutAction
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      href={item.href}
      onClick={() => setIsMobileOpen(false)}
      className={`sidebar-link ${
        isActive(item.href)
          ? 'bg-white/15 !text-white font-medium'
          : ''
      }`}
    >
      {item.icon}
      <span>{item.label}</span>
    </Link>
  )

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="mb-8 pb-6 border-b border-white/10">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-default.svg"
            alt="LIKQ"
            width={90}
            height={28}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            {section.title && (
              <div className="mt-6 mb-2 sidebar-section-title">
                {section.title}
              </div>
            )}
            {section.items.map(item => (
              <NavLink key={item.href + item.label} item={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 pt-4 mt-4">
        <div className="flex items-center justify-between px-3 text-sm">
          <div className="flex flex-col min-w-0">
            <span className="text-white font-medium truncate">
              {userName || userEmail}
            </span>
            <span className="text-white/50 text-xs truncate">{role}</span>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="p-2 text-white/50 hover:text-danger transition-colors flex-shrink-0"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-primary border-b-0 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/logo-default.svg"
            alt="LIKQ"
            width={80}
            height={24}
          />
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-[#153051] to-[#0f2340] border-r-0 p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors lg:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 sidebar-bg p-6 flex-col flex-shrink-0 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-14" />
    </>
  )
}
