'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Bell } from 'lucide-react';
import Youtube from '@/ui/Icons/YouTube';
import Mailbox from '@/ui/Icons/Mailbox';
import Logo from '@/ui/Icons/Logo';
import Hamburger from '@/ui/Icons/Hamburger';


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-red-500  fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 pt-[68px]">
        <div className="relative flex h-16 items-center justify-between"> 
          {/* Mobile menu button */}
          {/* <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div> */}

          {/* Desktop Navigation */}
          {/* <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"> */}
            {/* Logo */}
            <div className="flex items-center">
              {/* <Image 
                className="h-8 w-auto" 
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" 
                alt="Your Company" 
                width={32} 
                height={32}
              /> */}
              <Logo  />
            </div>

            {/* Desktop Menu Links */}
              <div className="hidden md:flex space-x-[72px]">
                <Link 
                  href="#" 
                  className="px-8 py-4 text-h3  text-white  hover:text-primary"
                >
                  Our Services
                </Link>
                <Link 
                  href="#" 
                  className="px-8 py-4 text-h3  text-white  hover:text-primary"
                >
                  Our Work
                </Link>
                <Link 
                  href="#" 
                  className="px-8 py-4 text-h3  text-white  hover:text-primary"
                >
                  Our Team
                </Link>
              </div>
            {/* </div> */}

          {/* Right side icons */}
          <div className="hidden md:flex items-center gap-x-8">
            
            <button
              type="button"
              className="relative rounded-full"
            >
              <Youtube />
            </button>
            <button
              type="button"
              className="relative rounded-full"
            >
              <Mailbox />
            </button>
            
            

            {/* Profile Dropdown
            <div className="relative ml-3">
              <button
                type="button"
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="sr-only">Open user menu</span>
                <Image 
                  className="h-8 w-8 rounded-full" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="User profile" 
                  width={32} 
                  height={32}
                />
              </button>
            </div> */}
          </div>

          <div className="flex lg:hidden">
          <button
              type="button"
              className="relative rounded-full"
            >
              <Hamburger />
            </button>
        </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link 
              href="#" 
              className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
            >
              Dashboard
            </Link>
            <Link 
              href="#" 
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Team
            </Link>
            <Link 
              href="#" 
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Projects
            </Link>
            <Link 
              href="#" 
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Calendar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );

}
  
export default Navbar