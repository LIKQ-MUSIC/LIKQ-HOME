import React from 'react'
import { Paragraph } from '@/ui/Typography'
import { Eye } from 'lucide-react'
import { IVideoDetails } from '@/services'

const VideoDetail = ({ description, statistics }: IVideoDetails) => {
  return (
    <>
      <Paragraph className="line-clamp-4">{description}</Paragraph>
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
