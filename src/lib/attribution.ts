import { z } from "zod";

const value = z.string().trim().max(500).nullable().default(null);

export const attributionTouchpointSchema = z.object({
  gclid: value,
  gbraid: value,
  wbraid: value,
  yclid: value,
  utmSource: value,
  utmMedium: value,
  utmCampaign: value,
  utmContent: value,
  utmTerm: value,
  landingPage: z.string().trim().max(2000),
  referrer: z.string().trim().max(2000).nullable(),
  capturedAt: z.string().datetime(),
});

export const attributionSchema = z.object({
  visitorId: z.string().trim().max(100).nullable().default(null),
  journeyId: z.string().trim().max(100).nullable().default(null),
  firstTouch: attributionTouchpointSchema,
  lastTouch: attributionTouchpointSchema,
  originalLandingPage: z.string().trim().max(2000).nullable().default(null),
  latestLandingPage: z.string().trim().max(2000).nullable().default(null),
  initialReferrer: z.string().trim().max(2000).nullable().default(null),
  latestReferrer: z.string().trim().max(2000).nullable().default(null),
  // Backward compatibility with karim_attribution_v2 payloads.
  lastLandingPage: z.string().trim().max(2000).nullable().default(null),
});

export type AttributionTouchpoint = z.infer<typeof attributionTouchpointSchema>;
export type Attribution = z.infer<typeof attributionSchema>;
export type AttributionSource =
  | "GOOGLE"
  | "YANDEX"
  | "DIRECT"
  | "ORGANIC"
  | "REFERRAL"
  | "MANUAL"
  | "UNKNOWN";

export function parseAttribution(raw: unknown): Attribution | null {
  const parsed = attributionSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export function classifySource(
  touch: AttributionTouchpoint,
): AttributionSource {
  const source = touch.utmSource?.toLowerCase();
  const medium = touch.utmMedium?.toLowerCase();
  const paid = ["cpc", "ppc", "paid", "paid_search"].includes(medium ?? "");
  if (
    touch.gclid ||
    touch.gbraid ||
    touch.wbraid ||
    (source === "google" && paid)
  )
    return "GOOGLE";
  if (touch.yclid || (source === "yandex" && paid)) return "YANDEX";
  if (
    medium === "organic" ||
    /(?:google|yandex|bing)\.|(?:^|\/)ya\.ru/i.test(touch.referrer ?? "")
  )
    return "ORGANIC";
  if (!touch.referrer && !source && !medium) return "DIRECT";
  if (touch.referrer || source) return "REFERRAL";
  return "UNKNOWN";
}

export function attributionRecord(raw: unknown) {
  let input: unknown = raw;
  if (typeof raw === "string") {
    try {
      input = JSON.parse(raw);
    } catch {
      input = null;
    }
  }
  const attribution = parseAttribution(input);
  if (!attribution) return {};
  const { firstTouch: first, lastTouch: last } = attribution;
  return {
    gclid: last.gclid ?? first.gclid,
    gbraid: last.gbraid ?? first.gbraid,
    wbraid: last.wbraid ?? first.wbraid,
    yclid: last.yclid ?? first.yclid,
    utmSource: last.utmSource,
    utmMedium: last.utmMedium,
    utmCampaign: last.utmCampaign,
    utmContent: last.utmContent,
    utmTerm: last.utmTerm,
    utmAdgroup: extractYandexContent(last.utmContent).adgroup,
    utmAd: extractYandexContent(last.utmContent).ad,
    visitorId: attribution.visitorId,
    journeyId: attribution.journeyId,
    firstTouch: first,
    lastTouch: last,
    originalLandingPage: attribution.originalLandingPage ?? first.landingPage,
    currentLandingPage:
      attribution.latestLandingPage ??
      attribution.lastLandingPage ??
      last.landingPage,
    attributionReferrer: attribution.initialReferrer ?? first.referrer,
    firstLandingPage: first.landingPage,
    lastLandingPage:
      attribution.latestLandingPage ??
      attribution.lastLandingPage ??
      last.landingPage,
    referrer: attribution.latestReferrer ?? last.referrer,
    firstTouchSource: classifySource(first),
    lastTouchSource: classifySource(last),
  };
}

function extractYandexContent(content: string | null) {
  if (!content) return { adgroup: null, ad: null };
  return {
    adgroup: content.match(/(?:^|\.)gbid_([^.]*)/)?.[1] ?? null,
    ad: content.match(/(?:^|\.)ad_([^.]*)/)?.[1] ?? null,
  };
}
