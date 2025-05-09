'use client'

import { useState, useEffect } from 'react'
import { useMobile } from '@/hooks/use-mobile'
import Hamburger from '@/ui/Icons/Hamburger'
import Close from '@/ui/Icons/Close'
import Youtube from '@/ui/Icons/YouTube'
import Mailbox from '@/ui/Icons/Mailbox'
import NavbarLinks from '../NavbarLinks/NavbarLinks'
import Logo from '@/ui/Icons/Logo'
import MobileNavLinks from '@/components/MobileNavLinks/MobileNavLinks'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMobile()

  // Close menu when switching to desktop
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [isMobile, isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="bg-red-300">
      <nav className=" w-full max-w-7xl px-4 py-2 mx-auto lg:px-8 lg:py-3 ">
        <div className="container flex flex-wrap items-center justify-between mx-auto px-[18px]">
          {/* <LogoButton /> */}
          <a href="#" className="mr-4 hidden lg:block cursor-pointer py-1.5">
            <img src="/logo-default.svg"></img>
          </a>

          <a href="#" className="mr-4 lg:hidden cursor-pointer py-1.5">
            {/* <img src="/logo-hover.svg"></img> */}
            <Logo className="h-90 w-28" fill="#153051" />
          </a>
          <NavbarLinks />
          <div className="lg:flex items-center gap-8 hidden">
            <Youtube className="youtube-icon" href="https://youtube.com" />
            <Mailbox className="mailbox-icon" />
          </div>

          <button
            onClick={toggleMenu}
            className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              {isMenuOpen ? <Close /> : <Hamburger />}
            </span>
          </button>

          {/* Mobile Menu */}
          {isMenuOpen && isMobile && (
            <div className="absolute top-16 right-0 bg-white w-64 z-50 shadow-lg md:hidden">
              <nav className="flex flex-col py-4">
                <MobileNavLinks onLinkClick={() => setIsMenuOpen(false)} />
              </nav>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar
