export type SeoLocale = "en" | "ru" | "tr";

/** One value per locale. A missing locale means "no custom content yet": the page falls back to its generic template. */
export type Localized<T> = Partial<Record<SeoLocale, T>>;

/**
 * Rich text: plain text with inline links written as `[label](trip:<slug>)`
 * (or `[label](/path)` for any other internal path, without the locale prefix).
 * Links are rendered with the locale-aware Link, so they always get /en/, /ru/ or /tr/.
 */
export type RichText = string;

export type FaqEntry = {
  question: string;
  answer: RichText;
};

export type DestinationSeoConfig = {
  slug: string;

  meta?: Localized<{ title: string; description: string; h1: string }>;

  breadcrumbLabel?: Localized<string>;

  season?: {
    lowSeason: boolean;
    notice?: Localized<string>;
    chips?: { slug: string; label: Localized<string> }[];
    tripPageNotice?: Localized<string>;
    lastTripTypes?: string[];
  };

  intro?: Localized<{ lead: RichText; body: RichText[] }>;

  faq?: Localized<{ title: string; items: FaqEntry[] }>;

  trips?: {
    priority?: string[];
    off?: string[];
    hidden?: string[];
  };
};
