'use client'

import React, { useState } from 'react'
import { Title } from '@/ui/Typography'
import Section from '@/components/Section'
import WorkDetail from './_components/WorkDetail'
import { IWorkItem } from '@/components/Works/types'
import WorkItem from './_components/WorkItem'
import Modal from '@/ui/Modal'
import { useVideosListDetails } from '@/hooks/api'

interface WorksProps {
  items: IWorkItem[]
}

const Works = ({ items = [] }: WorksProps) => {
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
    <Section id="work" className="" label="Our Works" title="ผลงานของเรา">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1 mt-8 md:p-5 lg:p-10 min-h-[400px] items-start w-full max-w-6xl">
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
