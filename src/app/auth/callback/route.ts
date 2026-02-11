import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { apiClient } from '@/lib/api-client'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Create user in our DB if needed (sync logic)
      if (data.user && data.session) {
        try {
          await apiClient.post(
            '/users',
            {
              email: data.user.email,
              name:
                data.user.user_metadata?.name || data.user.email?.split('@')[0],
              avatar_url: data.user.user_metadata?.avatar_url
            },
            {
              headers: {
                Authorization: `Bearer ${data.session.access_token}`
              }
            }
          )
        } catch (dbError) {
          console.error('Failed to sync user with DB:', dbError)
          // Continue anyway, as auth is successful
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
