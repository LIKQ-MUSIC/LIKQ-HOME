'use client'

import React from 'react'
import { Title } from '@/ui/Typography'
import Section from '@/components/Section'

import WorkDetail from './_components/WorkDetail'
import { WorkCarouselProps } from './_components/WorkCarousel/types'
import WorkCarousel from '@/components/Works/_components/WorkCarousel'
import { IWorkItem } from '@/components/Works/types'
import dayjs from '@/utils/dayjs'

const items: IWorkItem[] = [
  {
    title: 'YOU: YORA & YOU FAN MEETING',
    category: 'event',
    image:
      'https://firebasestorage.googleapis.com/v0/b/likq-38cdb.firebasestorage.app/o/works%2Fyou%20yorayou%20thumbnail.jpg?alt=media&token=327f9f99-1cc4-4dc8-bbb9-f567d7a7423c',
    description: `YOU: YORA & U FAN MEET คือกิจกรรมแฟนมีตครั้งแรกจาก Kim Yora
พบกับโชว์ดนตรีสดสุดอบอุ่น พร้อมเซอร์ไพรส์ที่เตรียมมาเพื่อคุณ
ร่วมสร้างความทรงจำและโมเมนต์พิเศษเฉพาะแฟน ๆ เท่านั้น
มาร่วมเป็นส่วนหนึ่งของค่ำคืนที่เต็มไปด้วยเสียงเพลงและความรัก`,
    url: 'https://you-fanmeet-uz8l.vercel.app/',
    start: dayjs('2025-05-25T19:00'),
    end: dayjs('2025-05-25T20:00'),
    location: 'Black Neko'
  },
  {
    title: 'LiKQ Music Soundcloud',
    category: 'link',
    description:
      'SoundCloud ของ LiKQ ที่คุณสามารถติดตามเพลงใหม่, โปรเจกต์ต่าง ๆ ที่กำลังจะเกิดขึ้นได้ เพลงอื่น ๆ ที่ไม่ได้ลงผ่าน Youtube',
    image:
      'https://firebasestorage.googleapis.com/v0/b/likq-38cdb.firebasestorage.app/o/staff%2Flikq-soundcloud.jpeg?alt=media&token=a504954d-8a1d-428b-990e-f28a52220c04',
    url: `https://soundcloud.com/prod-lightz`
  },
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
    <Section id="work" className="" title="Our Works">
      <Title className="text-center" level={5}>
        ตัวอย่างผลงานของ LiKQ Music
      </Title>

      <div className="p-1 mt-4 md:p-5 lg:p-10">
        <WorkDetail item={focusItem} />

        <WorkCarousel setFocusItem={setFocusItem} items={items} />
      </div>
    </Section>
  )
}

export default Works
