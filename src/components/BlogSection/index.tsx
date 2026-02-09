import Image from 'next/image'
import Link from 'next/link'
import { Title, Paragraph } from '@/ui/Typography'
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
    <section id="blog" className="py-16 md:py-24 px-4 md:px-8">
      {/* Storytelling: ความหมายของสีค่าย */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <Paragraph variant="label" className="mb-4">
          Our Story
        </Paragraph>
        <Title className="text-center" level={2}>
          เรื่องเล่าผ่านสีของเรา
        </Title>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Navy */}
          <div className="flex flex-col items-center max-w-xs">
            <div className="w-20 h-20 rounded-full bg-[#153051] shadow-lg mb-4" />
            <h3 className="text-lg font-bold text-[#153051] mb-2">Navy</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              สีกรมท่า คือความลึกซึ้งและมั่นคง
              เหมือนทะเลลึกที่ไม่เคยหยุดนิ่ง — สะท้อนถึงความตั้งใจ ความเป็นมืออาชีพ
              และรากฐานที่แข็งแกร่งของพวกเรา
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-32 bg-gray-200" />
          <div className="block md:hidden h-px w-32 bg-gray-200" />

          {/* Lavender */}
          <div className="flex flex-col items-center max-w-xs">
            <div className="w-20 h-20 rounded-full bg-[#B4A7D6] shadow-lg mb-4" />
            <h3 className="text-lg font-bold text-[#7B68AE] mb-2">Lavender</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              สีลาเวนเดอร์ คือจินตนาการและความคิดสร้างสรรค์
              เหมือนกลิ่นหอมที่ปลุกแรงบันดาลใจ — สะท้อนถึงความฝัน ความอ่อนโยน
              และเอกลักษณ์ที่ไม่เหมือนใคร
            </p>
          </div>
        </div>

        <p className="mt-10 text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
          เมื่อสองสีนี้มาบรรจบกัน มันคือตัวตนของ LIKQ —
          ความสมดุลระหว่างความมั่นคงกับจินตนาการ
          ระหว่างความเป็นมืออาชีพกับความกล้าที่จะแตกต่าง
          เราเชื่อว่าทุกเสียงเพลงเกิดจากเรื่องราว
          และนี่คือเรื่องราวของเรา
        </p>
      </div>

      {/* Blog Posts */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Title className="!mb-0" level={3}>
              บทความล่าสุด
            </Title>
            <p className="text-gray-500 text-sm mt-1">
              เรื่องราว บทเรียน และแรงบันดาลใจจากพวกเรา
            </p>
          </div>
          <Link
            href="/blogs"
            className="text-sm font-medium text-[#153051] hover:text-[#1e4a7a] transition-colors underline-offset-4 hover:underline"
          >
            ดูทั้งหมด →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#153051] to-[#B4A7D6]">
                      <span className="text-white/30 text-5xl font-bold">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  {post.published_at && (
                    <time className="text-xs text-gray-400 mb-2 block">
                      {dayjs(post.published_at).format('D MMMM YYYY')}
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
                    อ่านต่อ →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#153051] text-white rounded-full hover:bg-[#1e4a7a] transition-colors font-medium"
          >
            ดูบทความทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
