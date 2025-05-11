import { useQuery } from '@tanstack/react-query'
import { getVideoDetails } from '@/services'

export const useVideoDetails = (id: string) => {
  return useQuery({
    queryKey: ['videoDetails', id],
    queryFn: () => getVideoDetails(id),
    enabled: !!id
  })
}
