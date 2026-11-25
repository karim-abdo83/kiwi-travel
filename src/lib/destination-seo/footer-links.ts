// Client-safe data for the footer "Quick Links" block: links of the country of the destination being viewed.
import type { Localized } from "./types";

export type CountryKey = "egypt" | "turkey";
export type QuickLink = { href: string; label: Localized<string> };

/** Destination slug → country. Destinations not listed keep the default (Egypt) links. */
export const DESTINATION_COUNTRY: Record<string, CountryKey> = {
  "antalya-day-tours": "turkey",
  "kemer-day-tours": "turkey",
  "alanya-day-tours": "turkey",
  "belek-day-tours": "turkey",
  "side-day-tours": "turkey",
};

export const COUNTRY_QUICK_LINKS: Partial<Record<CountryKey, QuickLink[]>> = {
  turkey: [
    { href: "/destinations/country/turkey", label: { en: "Turkey excursions", ru: "Экскурсии в Турции", tr: "Türkiye turları" } },
    { href: "/destinations/antalya-day-tours", label: { en: "Antalya day tours", ru: "Экскурсии из Анталии", tr: "Antalya turları" } },
    { href: "/destinations/kemer-day-tours", label: { en: "Kemer day tours", ru: "Экскурсии из Кемера", tr: "Kemer turları" } },
    { href: "/destinations/alanya-day-tours", label: { en: "Alanya day tours", ru: "Экскурсии из Алании", tr: "Alanya turları" } },
    { href: "/destinations/belek-day-tours", label: { en: "Belek day tours", ru: "Экскурсии из Белека", tr: "Belek turları" } },
    { href: "/destinations/side-day-tours", label: { en: "Side day tours", ru: "Экскурсии из Сиде", tr: "Side turları" } },
  ],
};

/** Country for a pathname without locale prefix (/destinations/<slug> or /destinations/country/<country>). */
export function countryForPath(pathname: string): CountryKey | undefined {
  const country = pathname.match(/^\/destinations\/country\/([^/]+)/)?.[1];
  if (country && country in COUNTRY_QUICK_LINKS) return country as CountryKey;
  const slug = pathname.match(/^\/destinations\/([^/]+)/)?.[1];
  return slug ? DESTINATION_COUNTRY[slug] : undefined;
}
