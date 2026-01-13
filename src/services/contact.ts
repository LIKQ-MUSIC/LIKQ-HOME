import { sendContactEmailRepo, ContactPayload } from '@/repositories'

export const sendContactEmail = async (payload: ContactPayload) => {
  const resp = await sendContactEmailRepo(payload)
  return resp.data
}
