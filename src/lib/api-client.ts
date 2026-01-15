import axios from 'axios'
import { createClient } from '@/utils/supabase/client'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_API_URL || 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(async config => {
  if (typeof window !== 'undefined') {
    const supabase = createClient()
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
  }
  return config
})
