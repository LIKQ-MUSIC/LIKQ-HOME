import { IWorkItem } from '@/components/Works/types'

export interface WorkCarouselProps {
  items: IWorkItem[]
  setFocusItem: (item: IWorkItem) => void
}
