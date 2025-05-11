'use client'

import { Eye, Loader2, PlayCircle } from 'lucide-react'
import { Paragraph, Title } from '@/ui/Typography'
import { useVideoDetails } from '@/hooks/api/youtube'
import CategoriesBadge from '@/components/Works/_components/CategoriesBadge'

const WorkDetail = ({ youtubeId }: { youtubeId: string }) => {
  const { data, isLoading } = useVideoDetails(youtubeId)

  return (
    <div className="video-card">
      <div className="thumbnail-section">
        <div className="thumbnail-container">
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <>
              <img
                className="thumbnail"
                src={data?.thumbnailUrl}
                alt={data?.title}
              />
              <PlayCircle className="play-icon" size={32} />
            </>
          )}
        </div>
      </div>

      <div className="video-meta">
        <CategoriesBadge category="video" />

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
