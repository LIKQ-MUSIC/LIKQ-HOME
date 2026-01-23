import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

async function getWorksCount() {
  const supabase = await createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.access_token) return 0

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_GATEWAY_API_URL || 'http://localhost:3002'}/works`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        next: {
          revalidate: 0 // Fetch fresh data
        }
      }
    )

    if (!res.ok) return 0
    const data = await res.json()
    return data.data.length
  } catch (error) {
    console.error('Failed to fetch works count:', error)
    return 0
  }
}

export default async function WorksCountCard() {
  const worksCount = await getWorksCount()

  return (
    <Link
      href="/works"
      className="block transition-transform hover:scale-[1.02]"
    >
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm hover:border-zinc-700 cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-purple-500/10 p-3 text-purple-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-music"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">Works</p>
            <p className="text-2xl font-bold text-white">{worksCount}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
