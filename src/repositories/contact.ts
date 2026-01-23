import gatewayApi from '@/lib/axios'
import { AxiosResponse } from 'axios'

export interface ContactPayload {
  name: string
  phone: string
  email: string
  message: string
}

export const sendContactEmailRepo = (payload: ContactPayload) => {
  return gatewayApi.post<unknown, AxiosResponse<any>, ContactPayload>(
    '/contact',
    payload
  )
}
