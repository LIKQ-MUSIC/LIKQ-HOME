import { useState, useEffect } from 'react'
import { Breakpoints } from '@/constants/breakpoint'

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < Breakpoints.Mobile) // Adjust breakpoint as needed
    }

    // Set initial value
    handleResize()

    // Listen for window resize events
    window.addEventListener('resize', handleResize)

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}
