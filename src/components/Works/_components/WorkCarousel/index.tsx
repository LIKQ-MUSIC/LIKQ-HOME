'use client'

import { useVideosListDetails } from '@/hooks/api'

import { WorkCarouselProps } from './types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/ui/Carousel'
import WorkItem from '@/components/Works/_components/WorkItem'
import React from 'react'

const WorkCarousel = ({ items, setFocusItem }: WorkCarouselProps) => {
  const videoIds = items
    .filter(item => item.category === 'video')
    .map(item => item.youtubeId || '')

  const { data, isLoading } = useVideosListDetails(videoIds)

  const resultsItem = items.map(item => {
    if (item.category === 'video') {
      item.image = data?.find(v => v.videoId === item.youtubeId)?.thumbnailUrl
    }

    return item
  })

  return isLoading ? (
    'Loading...'
  ) : (
    <Carousel className="w-full mt-4">
      <CarouselContent>
        {resultsItem.map(work => (
          <CarouselItem
            className="basis-1/2 md:basis-1/3 lg:basis-1/4"
            key={work.title}
          >
            <WorkItem
              onClick={() => {
                setFocusItem(work)
              }}
              category={work.category}
              imageUrl={work.image || ''}
              name={work.title}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default WorkCarousel
