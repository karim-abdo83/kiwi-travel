import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { api } from '@/trpc/server';
import { BLOG_ARTICLE_SLUGS } from '@/lib/blog';
import {
  type AppLocale,
  availableLocales,
  buildAlternates,
  localizedUrl,
} from '@/lib/seo/alternates';

type SitemapEntry = MetadataRoute.Sitemap[number];

/** One entry per available locale, each declaring the same hreflang set as the page. */
function localizedEntries(
  path: string,
  options: Omit<SitemapEntry, 'url' | 'alternates'>,
  available: readonly AppLocale[] = routing.locales,
): MetadataRoute.Sitemap {
  return available.map((locale) => ({
    url: localizedUrl(locale, path),
    ...options,
    alternates: { languages: buildAlternates(path, locale, available).languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static, localized top-level routes
  const staticLocalized: MetadataRoute.Sitemap = [
    ...localizedEntries('', { lastModified: now, changeFrequency: 'daily', priority: 1 }),
    ...localizedEntries('/trips', { lastModified: now, changeFrequency: 'daily', priority: 0.8 }),
    ...localizedEntries('/destinations', { lastModified: now, changeFrequency: 'weekly', priority: 0.7 }),
    ...localizedEntries('/faqs', { lastModified: now, changeFrequency: 'yearly', priority: 0.3 }),
  ];

  // Country pages
  const countries = ['egypt', 'turkey'];
  const countryEntries = countries.flatMap((country) =>
    localizedEntries(`/destinations/country/${country}`, {
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }),
  );

  // Dynamic: trips (only locales with real content)
  let tripEntries: MetadataRoute.Sitemap = [];
  try {
    const trips = await api.trip.listStaticParams();
    tripEntries = trips.flatMap((t) =>
      localizedEntries(
        `/trips/${t.slug}`,
        { lastModified: t.updatedAt ?? now, changeFrequency: 'weekly', priority: 0.7 },
        availableLocales(t.titleTr),
      ),
    );
  } catch {
    // no-op: keep sitemap working even if trips fetch fails
  }

  // Dynamic: destinations (only locales with real content)
  let destinationEntries: MetadataRoute.Sitemap = [];
  try {
    const destinations = await api.destination.list({});
    destinationEntries = destinations.flatMap((d) =>
      localizedEntries(
        `/destinations/${d.slug}`,
        { lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
        availableLocales(d.nameTr),
      ),
    );
  } catch {
    // no-op
  }

  // Blog index
  const blogLocalized = localizedEntries('/blog', {
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  // Blog articles
  const blogArticles = BLOG_ARTICLE_SLUGS.flatMap((slug) =>
    localizedEntries(`/blog/${slug}`, {
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }),
  );

  return [
    ...staticLocalized,
    ...blogLocalized,
    ...countryEntries,
    ...blogArticles,
    ...tripEntries,
    ...destinationEntries,
  ];
}
