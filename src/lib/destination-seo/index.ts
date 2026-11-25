import { antalya } from "./antalya";
import type { DestinationSeoConfig, Localized, SeoLocale } from "./types";

export type { DestinationSeoConfig, Localized, SeoLocale } from "./types";

/** Destinations with their own SEO content. Add Kemer, Alanya, Belek, Side… here. */
const DESTINATION_SEO: Record<string, DestinationSeoConfig> = {
  [antalya.slug]: antalya,
};

export function getDestinationSeo(slug: string): DestinationSeoConfig | undefined {
  return DESTINATION_SEO[slug];
}

/** Value for the locale, or undefined when that locale has no custom content yet (no fallback to another language). */
export function pickLocale<T>(value: Localized<T> | undefined, locale: string): T | undefined {
  return value?.[locale as SeoLocale];
}

/** Trips that stay in the destination grid (config `hidden` removed). */
export function visibleTrips<T extends { slug: string }>(
  trips: readonly T[],
  config: DestinationSeoConfig | undefined,
): T[] {
  const hidden = new Set(config?.trips?.hidden ?? []);
  return trips.filter((trip) => !hidden.has(trip.slug));
}

/** Off-season info for a trip page, or null when the trip is active or its destination has no season config. */
export function getTripSeason(destinationSlug: string, tripSlug: string) {
  const config = getDestinationSeo(destinationSlug);
  if (!config?.season?.lowSeason || !config.trips?.off?.includes(tripSlug)) return null;
  return config;
}
