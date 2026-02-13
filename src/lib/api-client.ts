import axios from 'axios'
import { createClient } from '@/utils/supabase/client'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_API_URL || 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Cache the session to avoid calling getSession() on every single API request.
// The token is refreshed when it expires or after 5 minutes, whichever comes first.
let cachedToken: string | null = null
let tokenExpiresAt = 0

apiClient.interceptors.request.use(async config => {
  if (typeof window !== 'undefined') {
    const now = Date.now()
    if (!cachedToken || now >= tokenExpiresAt) {
      const supabase = createClient()
      const {
        data: { session }
      } = await supabase.auth.getSession()

      cachedToken = session?.access_token ?? null
      // Re-check session 5 min before actual expiry, or every 5 min if no expiry info
      const expiresIn = session?.expires_at
        ? session.expires_at * 1000 - now - 5 * 60 * 1000
        : 5 * 60 * 1000
      tokenExpiresAt = now + Math.max(expiresIn, 0)
    }

    if (cachedToken) {
      config.headers.Authorization = `Bearer ${cachedToken}`
    }
  }
  return config
})
