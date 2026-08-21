import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { locales } from '@/i18n/config'
import { articles } from '@/lib/articles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const tours = await db.tour.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true }
  })

  const sitemap: MetadataRoute.Sitemap = []

  // Static routes
  const staticRoutes = ['', '/tours', '/articles', '/about', '/contact', '/faq']
  
  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      })
    })
  })

  // Dynamic tour routes
  tours.forEach((tour) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/tours/${tour.slug}`,
        lastModified: tour.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.9,
      })
    })
  })

  articles.forEach((article) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/articles/${article.slug}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  })

  return sitemap
}
