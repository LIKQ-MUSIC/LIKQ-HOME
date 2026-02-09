import Link from 'next/link'
import Image from 'next/image'
import dayjs from '@/utils/dayjs'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ShoppingBag, Bell, ArrowLeft, Search } from 'lucide-react'
import { Paragraph } from '@/ui/Typography'

export const revalidate = 3600

const API_URL =
  process.env.NEXT_PUBLIC_GATEWAY_API_URL || 'http://localhost:3002'

async function getPublishedBlogs() {
  try {
    const res = await fetch(`${API_URL}/blogs/public?limit=50`, {
      next: { tags: ['blogs'] }
    })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
    return []
  }
}

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Top Controls Bar (Matching BlogContentRenderer) */}
      <div className="sticky top-0 z-[100] w-full border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-primary" />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors hidden sm:inline">
              กลับหน้าแรก
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

            <button
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Products"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

            <ThemeToggle />

            {/* Profile Placeholder */}
            <button className="ml-1 p-1 rounded-full border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                U
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="text-center mb-16">
          <Paragraph variant="label" className="mb-4">
            Our Blog
          </Paragraph>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            บทความทั้งหมด
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            เรื่องราว บทเรียน และแรงบันดาลใจจากทีม LiKQ Music Production
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-xl font-medium text-slate-900 dark:text-white mb-2">
              ยังไม่มีบทความ
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              ทีมเขียนของเรากำลังเตรียมเนื้อหาใหม่ๆ อยู่
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {blogs.map((blog: any) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="group flex flex-col h-full"
              >
                <article className="flex flex-col h-full bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Thumbnail Container */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {blog.thumbnail_url ? (
                      <Image
                        src={blog.thumbnail_url}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                        <span className="text-slate-300 dark:text-slate-700 text-6xl font-bold select-none">
                          {blog.title.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Date Badge */}
                    {blog.published_at && (
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
                        {dayjs(blog.published_at).format('D MMM YYYY')}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h2>

                    {blog.excerpt && (
                      <p className="text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6 flex-grow">
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50">
                      <span className="text-sm font-medium text-primary flex items-center gap-1 group/btn">
                        อ่านบทความ
                        <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
