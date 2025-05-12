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
  { href: '#services', label: 'Our Services' },
  { href: '#work', label: 'Our Work' },
  { href: '#team', label: 'Our Team' }
]

const MobileNavLinks: React.FC<MobileNavLinksProps> = ({ onLinkClick }) => {
  const goToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    const section = document.querySelector(href)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      history.pushState(null, '', href)
    }
  }

  return (
    <>
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className="px-8 py-3 text-center hover:bg-gray-50 block"
          onClick={e => {
            goToSection(e, link.href)
            onLinkClick()
          }}
        >
          {link.label}
        </Link>
      ))}
    </>
  )
}

export default MobileNavLinks
