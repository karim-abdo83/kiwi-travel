# PR 1: hreflang and sitemap (karimtor.com)

This spec comes from section 1 of `docs/seo/spec-seo-schemas-hreflang.md` and adds the sitemap. Structured data (section 2 of that spec) is left for PR 2.

## Working rules

- Work on the `SEO` branch, which currently matches `main` (`49f8e1b`).
- Do not commit or push. Martin reviews the changes and commits them himself.
- Do not delete files. Renaming is allowed.
- Do not touch the database schema, the migrations or the admin panel.
- Do not change anything outside what this spec asks for. If something else is worth fixing, note it at the end of the PR instead of changing it.
- When done, `pnpm typecheck` must pass with no errors.

## Context

- **Stack:** Next.js 15.5 (App Router) and next-intl 4.12.
- **Locales:** `en`, `ru` and `tr`, set in `src/i18n/routing.ts`. `en` is the default locale and every URL carries the locale prefix (`localePrefix: "always"`).
- **Domain:** `env.NEXT_PUBLIC_APP_URL`, with `https://karimtor.com` as the default value.
- **Redirect of URLs without a locale:** `src/middleware.ts` sends any path without a locale prefix to `/en/...` with a 301.
- **Turkish translations:** `trip.titleTr` and `destination.nameTr` have `default('')`, so they can be empty.

---

## Task 1: hreflang

### 1.1 Turn off the next-intl `Link` header

Today next-intl adds an HTTP `Link` header with hreflang to every response. Its `x-default` points to the path without a locale (for example `/trips/<slug>`), which redirects with a 301. It also emits hreflang for routes that return 404 (`/ru/google-ads/*`) or that are private (`/bookings`, `/dashboard`).

In `src/i18n/routing.ts`, add `alternateLinks: false` inside `defineRouting`. From then on, hreflang comes only from the HTML.

### 1.2 Canonical and alternates helper

Create `src/lib/seo/alternates.ts`:

```ts
import { env } from "@/env";
import { routing } from "@/i18n/routing";

export type AppLocale = (typeof routing.locales)[number];

export const SITE_URL = (env.NEXT_PUBLIC_APP_URL || "https://karimtor.com").replace(/\/$/, "");

export function localizedUrl(locale: string, path: string) {
  return `${SITE_URL}/${locale}${path}`;
}

/**
 * path: path without the locale prefix, starting with "/" ("" for the home page).
 * available: locales that have real content (all of them by default).
 */
export function buildAlternates(
  path: string,
  locale: string,
  available: readonly AppLocale[] = routing.locales,
) {
  const languages: Record<string, string> = {};
  for (const l of available) languages[l] = localizedUrl(l, path);
  if (available.includes(routing.defaultLocale)) {
    languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  }
  return { canonical: localizedUrl(locale, path), languages };
}

/** Locales with content for an entity that has translated fields. */
export function availableLocales(trValue: string | null | undefined): AppLocale[] {
  return trValue?.trim() ? ["en", "ru", "tr"] : ["en", "ru"];
}
```

### 1.3 Apply the helper

On each page, `alternates` in `generateMetadata` becomes `buildAlternates(...)`. If the page has no `generateMetadata`, create one. Everything else the page already returns (title, description, openGraph, etc.) stays the same.

| Page | File (`src/app/[locale]/(main)/…`) | Call |
|---|---|---|
| Home | `page.tsx` | `buildAlternates("", locale)` |
| Tours listing | `trips/page.tsx` | `buildAlternates("/trips", locale)` |
| Tour page | `trips/[slug]/page.tsx` | `buildAlternates(\`/trips/${slug}\`, locale, availableLocales(trip.titleTr))` |
| Destinations index | `destinations/page.tsx` | `buildAlternates("/destinations", locale)` |
| Destination | `destinations/[slug]/page.tsx` | `buildAlternates(\`/destinations/${slug}\`, locale, availableLocales(destination.nameTr))` |
| Country | `destinations/country/[country]/page.tsx` | `buildAlternates(\`/destinations/country/${country}\`, locale)` |
| FAQs | `faqs/page.tsx` | `buildAlternates("/faqs", locale)` |
| Blog (index) | `blog/page.tsx` | New `generateMetadata`: title and description from `Blog.title` and `Blog.subtitle`, plus `buildAlternates("/blog", locale)` |
| Blog (article) | `blog/[slug]/page.tsx` | New `generateMetadata`: title from `${slug}.title`, plus `buildAlternates(\`/blog/${slug}\`, locale)` |

The `google-ads/*`, `privacy`, `terms`, `bookings` and `dashboard` pages are not touched.

### 1.4 Pages without a Turkish translation

This rule applies to the tour page when `titleTr` is empty and to the destination page when `nameTr` is empty. In that case, when `locale === "tr"`:

- `generateMetadata` also returns `robots: { index: false, follow: true }`;
- the page is **not redirected**: it returns 200 as usual;
- the `tr` version does not appear in the hreflang of any of the three versions (`availableLocales` already handles this).

### 1.5 One list of blog articles

Today there are two different lists: `blog/page.tsx` has the 4 real keys, and `sitemap.ts` has `article1`, `article2` and `article3`, which do not exist in `messages/*.json`. Those sitemap URLs return a **500 error**, because `t.raw` fails on a missing key.

- Create `src/lib/blog.ts` and export the slug list from it:
  ```ts
  export const BLOG_ARTICLE_SLUGS = [
    "sahl-hasheesh-excursions",
    "el-gouna-excursions-guide",
    "sharm-airport-transfer",
    "top-places-to-visit-egypt",
  ] as const;
  ```
- Use this constant in `blog/page.tsx`, `blog/[slug]/page.tsx` and `sitemap.ts`.
- In `blog/[slug]/page.tsx`, if the slug is not in the list, call `notFound()` before any `t(...)`, both in the page and in `generateMetadata`.
- The `internalLinks` object in `blog/[slug]/page.tsx` uses old keys (`article1`…). Leave it as is and note it in the PR.

---

## Task 2: sitemap (`src/app/sitemap.ts`)

### 2.1 Current problems

1. **500 errors:** it lists `/{locale}/blog/article1`, `article2` and `article3`, which do not exist (9 URLs in total).
2. **Missing articles:** 3 of the 4 real blog articles are not listed.
3. **A URL that redirects:** it lists `${base}/`, which redirects to `/en` with a 301.
4. **Tours without Turkish:** it lists `/tr/trips/<slug>` even when the tour has no translation; with point 1.4, that page becomes noindex.
5. **Destinations without Turkish:** the same happens with `/tr/destinations/<slug>` when `nameTr` is empty.
6. **No hreflang:** the entries do not declare their versions in the other languages.

### 2.2 Changes

- Remove the `${base}/` entry.
- Blog articles come from `BLOG_ARTICLE_SLUGS`.
- **Tours:** in `listStaticParams` (`src/server/api/routers/trip.ts`), add `titleTr: true` to `columns`. This is a read-only change. Each tour generates entries only for `availableLocales(t.titleTr)`.
- **Destinations:** generate entries only for `availableLocales(d.nameTr)`.
- Every entry carries `alternates: { languages }`, which Next.js supports in `MetadataRoute.Sitemap`. The languages are the same ones the page declares, including `x-default`. To avoid duplicating logic, reuse `buildAlternates(path, locale, available).languages`.
- Use `SITE_URL` from `src/lib/seo/alternates.ts` instead of computing `base` again.
- Keep the `try/catch` blocks, so a database failure does not break the sitemap.
- Do not change `priority`, `changeFrequency` or `lastModified`.

Expected entry:

```ts
{
  url: "https://karimtor.com/ru/trips/pamukkale-from-antalya",
  lastModified: trip.updatedAt,
  changeFrequency: "weekly",
  priority: 0.7,
  alternates: {
    languages: {
      en: "https://karimtor.com/en/trips/pamukkale-from-antalya",
      ru: "https://karimtor.com/ru/trips/pamukkale-from-antalya",
      tr: "https://karimtor.com/tr/trips/pamukkale-from-antalya",
      "x-default": "https://karimtor.com/en/trips/pamukkale-from-antalya",
    },
  },
}
```

---

## Acceptance criteria (for the code review)

**Hreflang**

1. `curl -sI <preview>/ru/trips/<slug>` returns no `Link` header with `hreflang`.
2. Every page in table 1.3 has in its HTML an absolute `<link rel="canonical">`, one `<link rel="alternate" hreflang>` per available locale, and an `x-default` pointing to `/en/...`.
3. Every hreflang URL returns **200**, with no redirects.
4. Hreflang links are reciprocal between the versions of the same page.
5. For a tour without `titleTr`, `/tr/trips/<slug>` returns 200 with `noindex, follow`, and no version declares `hreflang="tr"`.
6. `/en/blog/article1` returns 404, not 500.

**Sitemap**

7. Every URL in `/sitemap.xml` returns 200:
   ```bash
   curl -s <preview>/sitemap.xml | grep -o '<loc>[^<]*' | sed 's/<loc>//' \
     | xargs -n1 -P8 curl -s -o /dev/null -w '%{http_code} %{url_effective}\n' | grep -v '^200'
   ```
   If the command prints nothing, every URL returned 200.
8. The sitemap has no `https://karimtor.com/` entry and no `/blog/article*` URL, and it lists the 4 real articles in all 3 locales.
9. Every `<url>` has `<xhtml:link rel="alternate" hreflang>` entries that match the page's own.
10. There are no `/tr/` URLs for tours or destinations without a translation.

**General**

11. `pnpm typecheck` passes with no errors.
12. The diff only touches the files in the list below.

## Affected files

- `src/i18n/routing.ts`
- `src/lib/seo/alternates.ts` (new)
- `src/lib/blog.ts` (new)
- `src/app/sitemap.ts`
- `src/server/api/routers/trip.ts` (`listStaticParams` only)
- `src/app/[locale]/(main)/page.tsx`
- `src/app/[locale]/(main)/trips/page.tsx`
- `src/app/[locale]/(main)/trips/[slug]/page.tsx` (`generateMetadata` only)
- `src/app/[locale]/(main)/destinations/page.tsx`
- `src/app/[locale]/(main)/destinations/[slug]/page.tsx` (`generateMetadata` only)
- `src/app/[locale]/(main)/destinations/country/[country]/page.tsx`
- `src/app/[locale]/(main)/faqs/page.tsx`
- `src/app/[locale]/(main)/blog/page.tsx`
- `src/app/[locale]/(main)/blog/[slug]/page.tsx`

## Out of scope (for other PRs)

- **Structured data:** PR 2.
- **Internal links without a locale prefix:** for example, `next/link` with `/trips/...` in "Similar trips". This is another cause of the indexed `/trips/...` URLs.
- **Typos in slugs** and their 301 redirects.
- **`robots.ts`:** it currently blocks `/dashboard/`, but the real routes are `/{locale}/dashboard/`, so that rule has no effect.
