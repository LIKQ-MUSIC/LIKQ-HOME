import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export const runtime = 'edge'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers()
  const domain = headersList.get('host')

  // Prevent bots from scanning the dev environment
  if (domain === 'dev.likqmusic.com') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/'
      }
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: 'https://www.likqmusic.com/sitemap.xml'
  }
}
