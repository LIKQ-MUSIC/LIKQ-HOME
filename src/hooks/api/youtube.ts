import { useQuery } from '@tanstack/react-query'
import { getVideoDetails, getVideoList } from '@/services'

export const useVideoDetails = (id: string) => {
  return useQuery({
    queryKey: ['videoDetails', id],
    queryFn: () => getVideoDetails(id),
    enabled: !!id
  })
}

export const useVideosListDetails = (ids: string[]) => {
  return useQuery({
    queryKey: ['useVideosListDetails', ids],
    queryFn: () => getVideoList(ids),
    enabled: ids && ids?.length !== 0
  })
}
