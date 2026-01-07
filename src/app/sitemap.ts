import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { env } from '@/env';
import { api } from '@/trpc/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (env.NEXT_PUBLIC_APP_URL || 'https://karimtor.com').replace(/\/$/, '');
  const now = new Date();

  // Static, localized top-level routes
  const staticLocalized = routing.locales.flatMap((locale) => [
    { url: `${base}/${locale}`, lastModified: now, changeFrequency: 'daily' as const, priority: 1 },
    { url: `${base}/${locale}/trips`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${base}/${locale}/destinations`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${base}/${locale}/faqs`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    // { url: `${base}/${locale}/terms`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    // { url: `${base}/${locale}/privacy`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
  ]);

  // Dynamic: trips (use listStaticParams for id/slug/updatedAt)
  let tripEntries: MetadataRoute.Sitemap = [];
  try {
    const trips = await api.trip.listStaticParams();
    tripEntries = trips.flatMap((t) =>
      routing.locales.map((locale) => ({
        url: `${base}/${locale}/trips/${t.slug}`,
        lastModified: t.updatedAt ?? now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    );
  } catch {
    // no-op: keep sitemap working even if trips fetch fails
  }

  // Dynamic: destinations (list and use slug)
  let destinationEntries: MetadataRoute.Sitemap = [];
  try {
    const destinations = await api.destination.list({});
    destinationEntries = destinations.flatMap((d: any) =>
      routing.locales.map((locale) => ({
        url: `${base}/${locale}/destinations/${d.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    );
  } catch {
    // no-op
  }

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    ...staticLocalized,
    ...tripEntries,
    ...destinationEntries,
  ];
}
