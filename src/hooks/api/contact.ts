import { useMutation } from '@tanstack/react-query'
import { sendContactEmail } from '@/services'
import { ContactPayload } from '@/repositories'

export const useSendContactEmail = () => {
  return useMutation({
    mutationFn: (payload: ContactPayload) => sendContactEmail(payload)
  })
}
