import { getVideoDetailsRepo } from '@/repositories'

interface IVideoDetails {
  videoId: string
  title: string
  thumbnailUrl: string
  description: string
  statistics: {
    view: number
    like: number
  }
}

export const getVideoDetails = async (id: string): Promise<IVideoDetails> => {
  const resp = await getVideoDetailsRepo(id)

  const { data } = resp
  const video = data.items?.[0]

  if (!video) {
    throw new Error('No video details found.')
  }

  return {
    videoId: video.id || '',
    title: video.snippet?.title || '',
    thumbnailUrl: video.snippet?.thumbnails?.maxres?.url || '',
    description: video.snippet?.description || '',
    statistics: {
      view: parseInt(video.statistics?.viewCount || '0', 10),
      like: parseInt(video.statistics?.likeCount || '0', 10)
    }
  }
}
