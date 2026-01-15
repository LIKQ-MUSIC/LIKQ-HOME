import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.likqmusic.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: 'https://www.likqmusic.com/core',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    }
  ]
}
