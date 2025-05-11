import { Category } from '@/components/Works/types'

export interface WorkCarouselProps {
  items: IWorkItem[]
  setFocusItem: (item: IWorkItem) => void
}

export type IWorkItem = {
  image?: string
  youtubeId?: string
  category: Category
  title: string
}
