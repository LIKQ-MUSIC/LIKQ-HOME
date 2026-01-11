'use client'

import React, { useState } from 'react'
import { Title } from '@/ui/Typography'
import Section from '@/components/Section'
import WorkDetail from './_components/WorkDetail'
import { IWorkItem } from '@/components/Works/types'
import dayjs from '@/utils/dayjs'
import WorkItem from './_components/WorkItem'
import Modal from '@/ui/Modal'
import { useVideosListDetails } from '@/hooks/api'

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
  const [selectedItem, setSelectedItem] = useState<IWorkItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  const videoIds = items
    .filter(item => item.category === 'video')
    .map(item => item.youtubeId || '')

  const { data: videoData } = useVideosListDetails(videoIds)

  const displayItems = items.map(item => {
    if (item.category === 'video' && videoData) {
      const details = videoData.find(v => v.videoId === item.youtubeId)
      return {
        ...item,
        image: details?.thumbnailUrl || item.image,
        title: details?.title || item.title
      }
    }
    return item
  })

  const filteredItems = displayItems.filter(item => {
    if (activeTab === 'all') return true
    if (activeTab === 'music') return item.category === 'video'
    return item.category === activeTab
  })

  const handleItemClick = (item: IWorkItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Optional: Clear selected item after animation or immediately
    // setSelectedItem(null) 
  }

  const tabs = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'music', label: 'เพลง' },
    { id: 'event', label: 'Event' },
    { id: 'link', label: 'Link' }
  ]

  return (
    <Section id="work" className="" title="Our Works">
      <Title className="text-center" level={5}>
        ตัวอย่างผลงานของ LiKQ Music
      </Title>

      <div className="flex justify-center gap-2 md:gap-4 mt-8 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-2 rounded-full transition-all duration-300 border
              ${
                activeTab === tab.id
                  ? 'bg-primary text-white border-primary shadow-lg scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary hover:scale-105'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1 mt-8 md:p-5 lg:p-10 min-h-[400px]">
        {filteredItems.map((item, index) => (
          <WorkItem
            key={`${item.title}-${index}`}
            imageUrl={item.image || ''}
            name={item.title}
            category={item.category}
            onClick={() => handleItemClick(item)}
            className="animate-scale-in"
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedItem && <WorkDetail item={selectedItem} />}
      </Modal>
    </Section>
  )
}

export default Works
