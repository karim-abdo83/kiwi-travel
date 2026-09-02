"use client";

import type { Attribution, AttributionTouchpoint } from "./attribution";
import { parseAttribution } from "./attribution";

const STORAGE_KEY = "karim_attribution_v3";
const LEGACY_STORAGE_KEY = "karim_attribution_v2";
const PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "yclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    ym?: (...args: unknown[]) => void;
  }
}

const clean = (input: string | null) => input?.trim().slice(0, 500) || null;

function landingPage(url: URL) {
  const kept = new URLSearchParams();
  for (const key of PARAMS) {
    const item = clean(url.searchParams.get(key));
    if (item) kept.set(key, item);
  }
  return `${url.pathname}${kept.size ? `?${kept}` : ""}`.slice(0, 2000);
}

function referrer() {
  try {
    const url = new URL(document.referrer);
    if (url.origin === window.location.origin) return null;
    return `${url.origin}${url.pathname}`.slice(0, 2000);
  } catch {
    return null;
  }
}

function currentTouch(): AttributionTouchpoint {
  const url = new URL(window.location.href);
  return {
    gclid: clean(url.searchParams.get("gclid")),
    gbraid: clean(url.searchParams.get("gbraid")),
    wbraid: clean(url.searchParams.get("wbraid")),
    yclid: clean(url.searchParams.get("yclid")),
    utmSource: clean(url.searchParams.get("utm_source")),
    utmMedium: clean(url.searchParams.get("utm_medium")),
    utmCampaign: clean(url.searchParams.get("utm_campaign")),
    utmContent: clean(url.searchParams.get("utm_content")),
    utmTerm: clean(url.searchParams.get("utm_term")),
    landingPage: landingPage(url),
    referrer: referrer(),
    capturedAt: new Date().toISOString(),
  };
}

export function hasKnownAttribution(touch: AttributionTouchpoint) {
  return Boolean(
    touch.gclid ||
      touch.gbraid ||
      touch.wbraid ||
      touch.yclid ||
      touch.utmSource ||
      touch.utmMedium ||
      touch.utmCampaign ||
      touch.utmContent ||
      touch.utmTerm ||
      touch.referrer,
  );
}

function randomId() {
  return crypto.randomUUID();
}

export function mergeAttribution(
  previous: Attribution | null,
  touch: AttributionTouchpoint,
  ids = { visitorId: randomId(), journeyId: randomId() },
): Attribution {
  const currentIsKnown = hasKnownAttribution(touch);
  const previousFirstIsKnown = previous
    ? hasKnownAttribution(previous.firstTouch)
    : false;
  return {
    visitorId: previous?.visitorId ?? ids.visitorId,
    journeyId: previous?.journeyId ?? ids.journeyId,
    firstTouch:
      previous && (previousFirstIsKnown || !currentIsKnown)
        ? previous.firstTouch
        : touch,
    lastTouch: currentIsKnown || !previous ? touch : previous.lastTouch,
    originalLandingPage:
      previous?.originalLandingPage ??
      previous?.firstTouch.landingPage ??
      touch.landingPage,
    latestLandingPage: touch.landingPage,
    initialReferrer:
      previous?.initialReferrer ??
      previous?.firstTouch.referrer ??
      touch.referrer,
    latestReferrer:
      touch.referrer ??
      previous?.latestReferrer ??
      previous?.lastTouch.referrer ??
      null,
    lastLandingPage: touch.landingPage,
  };
}

export function readAttribution(): Attribution | null {
  try {
    const current = window.localStorage.getItem(STORAGE_KEY);
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    return parseAttribution(JSON.parse(current ?? legacy ?? "null"));
  } catch {
    return null;
  }
}

export function captureAttribution(): Attribution {
  const previous = readAttribution();
  const touch = currentTouch();
  const next = mergeAttribution(previous, touch);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function serializeAttribution() {
  return JSON.stringify(captureAttribution());
}

export function currentAttribution() {
  return captureAttribution();
}

export function trackBookingStart() {
  const attribution = captureAttribution();
  const event = {
    event: "booking_start",
    journey_id: attribution.journeyId,
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
  window.ym?.(102714145, "reachGoal", "booking_start", event);
}

export function trackBookingComplete(input: {
  bookingId: number;
  value: number;
  currency: string;
  productId: number;
}) {
  const attribution = captureAttribution();
  const transactionId = String(input.bookingId);
  const dedupeKey = `karim_booking_complete:${transactionId}`;
  if (window.localStorage.getItem(dedupeKey)) return false;
  const event = {
    event: "booking_complete",
    transaction_id: transactionId,
    booking_id: transactionId,
    value: input.value,
    currency: input.currency,
    product_id: String(input.productId),
    journey_id: attribution.journeyId,
    visitor_id: attribution.visitorId,
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
  let attempts = 0;
  const sendToMetrica = () => {
    if (window.ym) {
      window.ym(102714145, "reachGoal", "booking_complete", event);
      return;
    }
    attempts += 1;
    if (attempts < 20) window.setTimeout(sendToMetrica, 150);
  };
  sendToMetrica();
  window.localStorage.setItem(dedupeKey, new Date().toISOString());
  return true;
}
