import { getVideoDetailsRepo, getVideosListRepo } from '@/repositories'
import Video = gapi.client.youtube.Video

export interface IVideoDetails {
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

  return videoToIVideoDetails(video)
}

const videoToIVideoDetails = (
  video: Video,
  thumbnailResolution?: 'standard' | 'maxres'
) => ({
  videoId: video.id || '',
  title: video.snippet?.title || '',
  thumbnailUrl:
    video.snippet?.thumbnails?.[thumbnailResolution || 'maxres']?.url || '',
  description: video.snippet?.description || '',
  statistics: {
    view: parseInt(video.statistics?.viewCount || '0', 10),
    like: parseInt(video.statistics?.likeCount || '0', 10)
  }
})

export const getVideoList = async (ids: string[]): Promise<IVideoDetails[]> => {
  const resp = await getVideosListRepo(ids)

  const { data } = resp

  return data.items?.map(v => videoToIVideoDetails(v, 'standard')) || []
}
