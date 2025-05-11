'use client'

import { Eye, PlayCircle, Video } from 'lucide-react'
import { Paragraph, Title } from '@/ui/Typography'
import { useVideoDetails } from '@/hooks/api/youtube'

export const VideoBadge = () => {
  return (
    <span className="inline-flex self-start items-center gap-1 rounded-full bg-secondary-light  px-2.5 py-1 text-sm font-medium text-primary">
      <Video className="h-4 w-4" />
      Video
    </span>
  )
}

const WorkDetail = () => {
  const { data, isLoading, error } = useVideoDetails('xiFj8DWFrxY')

  if (isLoading) return <Paragraph>Loading...</Paragraph>
  if (error) return <Paragraph>Error loading video</Paragraph>

  return (
    <div className="video-card">
      <div className="thumbnail-section">
        <div className="thumbnail-container">
          <img
            className="thumbnail"
            src={data?.thumbnailUrl}
            alt={data?.title}
          />
          <PlayCircle className="play-icon" size={32} />
        </div>
      </div>

      <div className="video-meta">
        <VideoBadge />

        <Title level={5} className="line-clamp-2">
          {data?.title}
        </Title>
        <Paragraph className="line-clamp-4">{data?.description}</Paragraph>
        <div className="video-stats">
          <Eye size={16} />
          <Paragraph>{data?.statistics.view} views</Paragraph>
          <Paragraph>•</Paragraph>
          <Paragraph>{data?.statistics.like} likes</Paragraph>
        </div>
      </div>
    </div>
  )
}

export default WorkDetail
