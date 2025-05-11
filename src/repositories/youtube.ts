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
