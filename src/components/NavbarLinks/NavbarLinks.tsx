import React from 'react'
import { Title } from '@/ui/Typography'

const NavbarLinks = () => {
  const links = [
    { href: '#services', label: 'Our Services' },
    { href: '#work', label: 'Our Work' },
    { href: '#team', label: 'Our Team' }
  ]

  const handleClick = (
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
    <div className="hidden lg:block">
      <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
        {links.map(({ href, label }) => (
          <li key={label} className="flex items-center px-8 py-4">
            <a
              href={href}
              onClick={e => handleClick(e, href)}
              className="flex items-center"
            >
              <Title level={6} className="text-white hover:text-primary">
                {label}
              </Title>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NavbarLinks
