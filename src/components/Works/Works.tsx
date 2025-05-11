'use client'

import React from 'react'
import { Title } from '@/ui/Typography'
import Section from '@/components/Section'

import WorkDetail from './_components/WorkDetail'
import { IWorkItem, WorkCarouselProps } from './_components/WorkCarousel/types'
import WorkCarousel from '@/components/Works/_components/WorkCarousel'

const items: IWorkItem[] = [
  {
    title: 'คาปิบาราไม่ได้นอน',
    category: 'video',
    youtubeId: 'mNGGAnQQC6w'
  },
  {
    title: 'still-with-you',
    category: 'video',
    youtubeId: '7arWJXUUJHI'
  },
  {
    title: 'warmest-snow',
    category: 'video',
    youtubeId: 'xiFj8DWFrxY'
  }
]

const Works = () => {
  const [focusItem, setFocusItem] = React.useState<
    WorkCarouselProps['items'][0]
  >(items[0])

  return (
    <Section title="Our Works">
      <Title level={5}>ตัวอย่างผลงานของ LiKQ Music</Title>

      <div className="p-10">
        <WorkDetail youtubeId={focusItem.youtubeId || ''} />

        <WorkCarousel setFocusItem={setFocusItem} items={items} />
      </div>
    </Section>
  )
}

export default Works
