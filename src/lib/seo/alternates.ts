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
