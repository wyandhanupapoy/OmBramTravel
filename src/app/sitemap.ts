import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { articles } from '@/lib/articles';
import { locales } from '@/i18n/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ombramtravel.com';
  const siteMapEntries: MetadataRoute.Sitemap = [];

  // Static routes
  const staticRoutes = ['', '/tours', '/articles', '/about', '/contact', '/faq'];
  
  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      siteMapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  // Dynamic Tour routes
  const tours = await db.tour.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true }
  });

  tours.forEach((tour) => {
    locales.forEach((locale) => {
      siteMapEntries.push({
        url: `${baseUrl}/${locale}/tours/${tour.slug}`,
        lastModified: tour.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });
  });

  // Dynamic Article routes
  articles.forEach((article) => {
    locales.forEach((locale) => {
      siteMapEntries.push({
        url: `${baseUrl}/${locale}/articles/${article.slug}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  return siteMapEntries;
}
