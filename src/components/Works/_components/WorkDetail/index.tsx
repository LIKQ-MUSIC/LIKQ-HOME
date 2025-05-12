'use client'

import { Eye, Loader2, PlayCircle } from 'lucide-react'
import { Paragraph, Title } from '@/ui/Typography'
import { useVideoDetails } from '@/hooks/api/youtube'
import CategoriesBadge from '@/components/Works/_components/CategoriesBadge'
import { IWorkItem } from '@/components/Works/types'
import VideoDetail from '@/components/Works/_components/WorkDetail/_components/VideoDetail'
import { useMemo, useState } from 'react'
import { useImageLoaded } from '@/hooks/use-image-loaded'
import { cn } from '@/utils'
import EventDetail from '@/components/Works/_components/WorkDetail/_components/EventDetail'

const WorkDetail = ({ item }: { item: IWorkItem }) => {
  const { data, isLoading } = useVideoDetails(
    item.category === 'video' ? item.youtubeId || '' : ''
  )

  const imageSrc = useMemo(
    () =>
      item.category === 'video' && !isLoading ? data?.thumbnailUrl : item.image,
    [item, data]
  )

  const { ref, loaded } = useImageLoaded(imageSrc || '')

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
              <a
                href={
                  item.category === 'video'
                    ? `https://youtube.com/watch?v=${item.youtubeId}`
                    : item.url || '#'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  ref={ref}
                  className={cn([
                    'thumbnail transition-all opacity-0',
                    loaded && 'opacity-1'
                  ])}
                  src={imageSrc}
                  alt={`thumbnail-${item.title}`}
                />
                {item.category === 'video' && (
                  <PlayCircle className="play-icon" size={32} />
                )}
              </a>
            </>
          )}
        </div>
      </div>

      <div className="video-meta">
        <CategoriesBadge category={item.category} />

        <Title level={5} className="line-clamp-2">
          {item.category === 'video' ? data?.title : item.title}
        </Title>

        {item.category === 'event' && <EventDetail {...item} />}
        {data && item.category === 'video' && <VideoDetail {...data} />}
      </div>
    </div>
  )
}

export default WorkDetail
