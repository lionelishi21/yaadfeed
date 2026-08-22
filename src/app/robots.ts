import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/test/',
          '/test-image-generation/',
          '/demand/',
          '/scratch/',
        ],
      },
    ],
    sitemap: 'https://yardvybz.news/sitemap.xml',
  }
}
