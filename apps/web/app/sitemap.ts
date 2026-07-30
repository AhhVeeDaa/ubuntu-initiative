import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ubuntu-initiative.org';
  const locales = ['en', 'fr', 'ln', 'sw'];

  const routes = [
    '',
    '/philosophy',
    '/blueprint',
    '/ai-orchestration',
    '/governance-framework',
    '/vision',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}/${locale}${route}`])
      ),
    },
  }));
}
