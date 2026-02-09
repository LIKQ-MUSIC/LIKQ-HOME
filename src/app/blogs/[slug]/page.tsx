import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BlogContentRenderer from '@/components/blog/BlogContentRenderer'

export const revalidate = 3600

const API_URL =
  process.env.NEXT_PUBLIC_GATEWAY_API_URL || 'http://localhost:3002'

async function getBlogBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/blogs/public/${slug}`, {
      next: { tags: [`blog-${slug}`] }
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/blogs/public?limit=100`)
    if (!res.ok) return []
    const json = await res.json()
    const blogs = json.data || []

    return blogs.map((blog: any) => ({ slug: blog.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  if (!blog) return { title: 'Blog Not Found' }
  return {
    title: `${blog.title} | LiKQ Music`,
    description: blog.excerpt || blog.title,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.title,
      images: blog.thumbnail_url ? [blog.thumbnail_url] : []
    }
  }
}

export default async function BlogDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  // Pass blog data to the shared renderer
  return <BlogContentRenderer blog={blog} />
}
