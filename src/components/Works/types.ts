export type Category = 'video' | 'event' | 'link'

export type IWorkItem = {
  image?: string
  youtubeId?: string
  category: Category
  title: string
  description?: string
  url?: string
}
