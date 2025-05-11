import { useState, useEffect, useRef } from 'react'

export function useImageLoaded<T extends HTMLImageElement>(src: string) {
  const ref = useRef<T | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = ref.current
    if (!img) return

    setLoaded(false) // reset loading state when src changes

    const handleLoad = () => setLoaded(true)
    const handleError = () => setLoaded(false)

    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)

    // if already loaded from cache
    if (img.complete && img.naturalHeight !== 0) {
      setLoaded(true)
    }

    return () => {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [src])

  return { ref, loaded }
}
