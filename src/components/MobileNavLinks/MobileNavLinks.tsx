import Link from 'next/link'
import React from 'react'

interface NavLink {
  href: string
  label: string
}

interface MobileNavLinksProps {
  onLinkClick: () => void
}

const links: NavLink[] = [
  { href: '/services', label: 'Our Services' },
  { href: '/work', label: 'Our Work' },
  { href: '/team', label: 'Our Team' },
  { href: '/contact', label: 'Contact' }
]

const MobileNavLinks: React.FC<MobileNavLinksProps> = ({ onLinkClick }) => {
  return (
    <>
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className="px-8 py-3 text-center hover:bg-gray-50 block"
          onClick={onLinkClick}
        >
          {link.label}
        </Link>
      ))}
    </>
  )
}

export default MobileNavLinks
