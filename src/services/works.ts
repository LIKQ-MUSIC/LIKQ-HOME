import { apiClient } from '@/lib/api-client'
import { IWorkItem } from '@/components/Works/types'
import dayjs from '@/utils/dayjs'

export const getWorks = async (): Promise<IWorkItem[]> => {
  try {
    const response = await apiClient.get('/works')
    const works = response.data.data

    if (!Array.isArray(works)) {
      return []
    }

    return works.map((work: any) => {
      const base = {
        title: work.title,
        description: work.description || undefined,
        image: work.image_url || undefined
      }

      if (work.category === 'video') {
        return {
          ...base,
          category: 'video',
          youtubeId: work.youtube_id || ''
        }
      } else if (work.category === 'event') {
        return {
          ...base,
          category: 'event',
          start: dayjs(work.start_date),
          end: dayjs(work.end_date),
          location: work.location || '',
          url: work.external_url || ''
        }
      } else {
        return {
          ...base,
          category: 'link',
          url: work.external_url || ''
        }
      }
    })
  } catch (error) {
    console.error('Failed to fetch works:', error)
    return []
  }
}
