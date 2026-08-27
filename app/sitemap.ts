import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eli7.ngo';

  // Static routes
  const routes = [
    '',
    '/about',
    '/our-work',
    '/programs',
    '/projects',
    '/impact',
    '/stories',
    '/news',
    '/gallery',
    '/get-involved',
    '/volunteer',
    '/partner',
    '/donate',
    '/contact',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...routes];
}