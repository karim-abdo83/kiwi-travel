"use client";

import type { Attribution, AttributionTouchpoint } from "./attribution";
import { parseAttribution } from "./attribution";

const STORAGE_KEY = "karim_attribution_v2";
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

function hasCampaignAttribution(touch: AttributionTouchpoint) {
  return Boolean(
    touch.gclid ||
      touch.gbraid ||
      touch.wbraid ||
      touch.yclid ||
      touch.utmSource ||
      touch.utmMedium ||
      touch.utmCampaign ||
      touch.utmContent ||
      touch.utmTerm,
  );
}

export function readAttribution(): Attribution | null {
  try {
    return parseAttribution(
      JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null"),
    );
  } catch {
    return null;
  }
}

export function captureAttribution(): Attribution {
  const previous = readAttribution();
  const touch = currentTouch();
  const next: Attribution = {
    firstTouch: previous?.firstTouch ?? touch,
    lastTouch:
      hasCampaignAttribution(touch) || !previous ? touch : previous.lastTouch,
    lastLandingPage: touch.landingPage,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function serializeAttribution() {
  return JSON.stringify(captureAttribution());
}

export function trackBookingComplete(input: {
  bookingId: number;
  value: number;
  currency: string;
  productId: number;
}) {
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
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
  window.ym?.(102714145, "reachGoal", "booking_complete", event);
  window.localStorage.setItem(dedupeKey, new Date().toISOString());
  return true;
}
