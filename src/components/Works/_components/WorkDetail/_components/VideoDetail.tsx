import React from 'react'
import { Paragraph } from '@/ui/Typography'
import { Eye } from 'lucide-react'
import { IVideoDetails } from '@/services'
import Link from 'next/link'
import Button from '@/ui/Button'

const VideoDetail = ({ description, statistics, videoId }: IVideoDetails) => {
  return (
    <>
      <Paragraph className="line-clamp-4 text-primary-light">{description}</Paragraph>
      <div className="video-stats">
        <Eye size={16} />
        <Paragraph>{statistics.view} views</Paragraph>
        <Paragraph>•</Paragraph>
        <Paragraph>{statistics.like} likes</Paragraph>
      </div>
    </>
  )
}

export default VideoDetail
