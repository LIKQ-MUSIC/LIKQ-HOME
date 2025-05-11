import { youtubeClient } from '@/utils/youtube'
import VideoListResponse = gapi.client.youtube.VideoListResponse

export const getVideoDetailsRepo = (id: string) => {
  return youtubeClient.get<VideoListResponse>('/videos', {
    params: {
      part: 'snippet,statistics',
      id
    }
  })
}

export const getVideosListRepo = (ids: string[]) => {
  return youtubeClient.get<VideoListResponse>('/videos', {
    params: {
      part: 'snippet',
      id: ids.join(',')
    }
  })
}
