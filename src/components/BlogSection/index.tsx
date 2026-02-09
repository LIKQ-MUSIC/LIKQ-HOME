import Image from 'next/image'
import Link from 'next/link'
import Section from '@/components/Section'
import { Title } from '@/ui/Typography'
import dayjs from '@/utils/dayjs'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  thumbnail_url: string | null
  published_at: string | null
}

interface BlogSectionProps {
  posts: BlogPost[]
}

const BlogSection = ({ posts }: BlogSectionProps) => {
  if (!posts || posts.length === 0) return null

  return (
    <Section id="blog" title="Latest from Our Blog">
      <Title className="text-center" level={5}>
        Stay updated with our latest stories, insights, and music production tips
      </Title>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 w-full max-w-6xl">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blogs/${post.slug}`}
            className="group block animate-scale-in"
          >
            <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] h-full flex flex-col">
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                {post.thumbnail_url ? (
                  <Image
                    src={post.thumbnail_url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#153051] to-[#1e4a7a]">
                    <span className="text-white/30 text-5xl font-bold">
                      {post.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                {post.published_at && (
                  <time className="text-xs text-gray-400 mb-2 block">
                    {dayjs(post.published_at).format('MMMM D, YYYY')}
                  </time>
                )}
                <h3 className="text-lg font-bold text-[#153051] mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-500 text-sm line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-3 text-primary text-sm font-medium group-hover:underline">
                  Read more →
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#153051] text-white rounded-full hover:bg-[#1e4a7a] transition-colors font-medium"
        >
          View All Posts
        </Link>
      </div>
    </Section>
  )
}

export default BlogSection
