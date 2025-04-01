'use client'

import { useState, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"
import Link from 'next/link'
import Hamburger from '@/ui/Icons/Hamburger'
import YoutubeButton from '@/ui/YoutubeButton'
import MailButton from '@/ui/MailButton'
import Close from '@/ui/Icons/Close'

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
      <nav className=" w-full max-w-7xl px-4 py-2 mx-auto  mt-[68px] sticky top-3  lg:px-8 lg:py-3 ">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          {/* <LogoButton /> */}
          <a href="#" className="mr-4 hidden lg:block cursor-pointer py-1.5">
            <img src="/logo-default.svg"></img>
          </a>

          <a href="#" className="mr-4 lg:hidden cursor-pointer py-1.5">
            <img src="/logo-hover.svg"></img>
          </a>
          <div className="hidden lg:block">
            <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              <li className="flex items-center px-8 py-4 text-h3  text-white  hover:text-primary">
                <a href="#" className="flex items-center">
                  Our Services
                </a>
              </li>
              <li className="flex items-center px-8 py-4 text-h3  text-white  hover:text-primary">
                <a href="#" className="flex items-center">
                  Our Work
                </a>
              </li>
              <li className="flex items-center px-8 py-4 text-h3  text-white  hover:text-primary">
                <a href="#" className="flex items-center">
                  Our Team
                </a>
              </li>
            </ul>
          </div>
          <div className="lg:flex items-center gap-8 hidden">
            <YoutubeButton href="https://youtube.com" />
            <MailButton />
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
          {isMenuOpen && isMobile &&  (
            <div className="absolute top-16 right-0 bg-white w-64 z-50 shadow-lg md:hidden">
              <nav className="flex flex-col py-4">
                <Link
                  href="/services"
                  className="px-8 py-3 text-center hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Our Services
                </Link>
                <Link
                  href="/work"
                  className="px-8 py-3 text-center hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Our Work
                </Link>
                <Link
                  href="/team"
                  className="px-8 py-3 text-center hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Our Team
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3 text-center hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar
