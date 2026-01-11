'use client'

import React, { useState, useEffect } from 'react'
import Hamburger from '@/ui/Icons/Hamburger'
import Close from '@/ui/Icons/Close'
import Youtube from '@/ui/Icons/YouTube'
import Mailbox from '@/ui/Icons/Mailbox'
import NavbarLinks from '../NavbarLinks/NavbarLinks'
import Logo from '@/ui/Icons/Logo'
import MobileNavLinks from '@/components/MobileNavLinks/MobileNavLinks'
import SoundCloud from '@/ui/Icons/SoundCloud'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileNav, setIsMobileNav] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Track screen size for mobile nav visibility (matching lg breakpoint)
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024
      setIsMobileNav(isMobile)
      if (!isMobile) {
        setIsMenuOpen(false)
      }
    }

    // Initial check
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle scroll for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      // Find the About Us or Services section to determine when to switch
      // We want to switch AFTER About Us. About Us is followed by Services.
      // So let's target the Services section.
      const servicesSection = document.getElementById('services')
      if (servicesSection && window.scrollY > servicesSection.offsetTop - 100) {
        setIsScrolled(true)
      } else {
        // Fallback or explicit reset
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navIconColor = isScrolled ? '#153051' : 'white'

  const outerNavLinks = (
    <>
      <Youtube className="youtube-icon" href="https://youtube.com/@likqmusic" />

      <a
        href="https://soundcloud.com/prod-lightz"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 p-2 transition-all rounded-full flex-all-center bg-white text-primary hover:bg-primary-hover hover:text-white"
      >
        <SoundCloud />
      </a>

      <Mailbox href="mailto:contact@likqmusic.com" className="mailbox-icon" />
    </>
  )

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <nav className="w-full max-w-7xl px-4 mx-auto lg:px-8 z-50">
        <div className="container flex flex-wrap items-center justify-between mx-auto px-[18px]">
          {/* <LogoButton /> */}
          <a href="#" className="mr-4 hidden lg:block cursor-pointer py-1.5">
            <Logo className="h-90 w-28" fill={navIconColor} />
          </a>

          <a href="#" className="mr-4 lg:hidden cursor-pointer py-1.5">
            {/* Mobile Logo */}
            <Logo className="h-90 w-28" fill={navIconColor} />
          </a>
          <NavbarLinks isScrolled={isScrolled} />
          <div className="lg:flex items-center gap-8 hidden">
            {outerNavLinks}
          </div>

          <button
            onClick={toggleMenu}
            className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              {isMenuOpen ? <Close fill={navIconColor} /> : <Hamburger fill={navIconColor} />}
            </span>
          </button>

          {/* Mobile Menu */}
          {isMenuOpen && isMobileNav && (
            <div className="absolute rounded-xl top-16 right-0 bg-white w-64 z-50 shadow-lg lg:hidden">
              <nav className="flex flex-col py-4">
                <MobileNavLinks onLinkClick={() => setIsMenuOpen(false)} />

                <div className="flex-all-center gap-8">{outerNavLinks}</div>
              </nav>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar
