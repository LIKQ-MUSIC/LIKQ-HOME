'use client'

import React, { useRef, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/utils'

import { VIDEO_URL } from './constants'

const VideoLanding = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  return (
    <>
      {/* Loading Spinner */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#030827]">
          <LoaderCircle className="animate-spin text-white w-10 h-10" />
        </div>
      )}

      {/* Video Background */}
      <video
        ref={videoRef}
        className={cn(
          'absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-700 object-[70%_center] lg:object-center', // 👈 this controls left/right positioning
          isVideoLoaded ? 'opacity-100' : 'opacity-0'
        )}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => {
          setIsVideoLoaded(true)
        }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
    </>
  )
}

export default VideoLanding
