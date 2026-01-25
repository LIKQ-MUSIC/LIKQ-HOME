'use client'

import React, { useRef, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/utils'

import { VIDEO_URL } from './constants'

const VideoLanding = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Check if video is already loaded from cache
  React.useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsVideoLoaded(true)
    }
  }, [])

  return (
    <>
      {/* Static Fallback Image for LCP & Mobile */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about/team-studio.jpg"
          alt="LiKQ Music Studio Background"
          fill
          priority
          className="object-cover object-[68%_center] lg:object-center"
        />
      </div>

      {/* Loading Spinner */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
          <LoaderCircle className="animate-spin text-white w-10 h-10" />
        </div>
      )}

      {/* Video Background */}
      <video
        ref={videoRef}
        className={cn(
          'absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-700 object-[68%_center] lg:object-center',
          isVideoLoaded ? 'opacity-100' : 'opacity-0'
        )}
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setIsVideoLoaded(true)}
        onLoadedData={() => setIsVideoLoaded(true)}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
    </>
  )
}

export default VideoLanding
