'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Bell } from 'lucide-react';
import Youtube from '@/ui/Icons/YouTube';
import Mailbox from '@/ui/Icons/Mailbox';
import Logo from '@/ui/Icons/Logo';
import Hamburger from '@/ui/Icons/Hamburger';
import YoutubeButton from '@/ui/YoutubeButton';
import MailButton from '@/ui/MailButton';
import LogoButton from '@/ui/LogoButton';


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="bg-red-300">
       <nav className="flex justify-between items-center w-[92%] mx-auto">
    <div>
      {/* <Image 
        src="https://cdn-icons-png.flaticon.com/512/5968/5968204.png" 
        alt="Logo" 
        width={64} 
        height={64} 
        className="cursor-pointer"
      /> */}
      <LogoButton></LogoButton>
    </div>
    <div
      className={`md:static absolute md:min-h-fit min-h-[60vh] left-0 md:w-auto w-full flex items-center px-5 ${
        menuOpen ? 'top-[9%]' : 'top-[-100%]'
      }`}
    >
      <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
        <li>
          <Link href="#" className="px-8 py-4 text-h3  text-white  hover:text-primary">
          Our Services
          </Link>
        </li>
        <li>
          <Link href="#" className="px-8 py-4 text-h3  text-white  hover:text-primary">
          Our Work
          </Link>
        </li>
        <li>
          <Link href="#" className="px-8 py-4 text-h3  text-white  hover:text-primary">
          Our Team
          </Link>
        </li>
      </ul>
    </div>
    <div className="flex items-center gap-8">
      {/* <button className="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec]">
        Sign in
      </button> */}
      <YoutubeButton href="https://youtube.com" />
      <MailButton  />
      {/* <div className="text-3xl cursor-pointer md:hidden" onClick={toggleMenu}>
        {menuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
      </div> */}
    </div>
  </nav>
    </div>
   
  );

}
  
export default Navbar