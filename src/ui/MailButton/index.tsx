import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

// Approach 1: Using Image component with two separate SVG files
export default function MailButton({ href = "#" }: { href?: string }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block relative w-[48px] h-[48px]"
    >
      <Image
        src={isHovered ? "/mail-hover.svg" : "/mail-default.svg"}
        alt="YouTube"
        width={48}
        height={48}
        className="transition-all duration-300"
      />
    </Link>
  )
}
