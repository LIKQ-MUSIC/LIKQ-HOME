import dayjs from '@/utils/dayjs'

export type Category = 'video' | 'event' | 'link'

export interface BaseWorkItem {
  image?: string
  title: string
  description?: string
}

export interface VideoWorkItem extends BaseWorkItem {
  youtubeId: string
  category: 'video'
}

export interface EventWorkItem extends BaseWorkItem {
  category: 'event'
  start: dayjs.Dayjs | string
  end: dayjs.Dayjs | string
  location: string
  url: string
}

export interface LinkWorkItem extends BaseWorkItem {
  category: 'link'
  url: string
}

export type IWorkItem = VideoWorkItem | EventWorkItem | LinkWorkItem
