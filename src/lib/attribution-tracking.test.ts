import test from "node:test";
import assert from "node:assert/strict";
import type { AttributionTouchpoint } from "./attribution";
import { mergeAttribution, trackBookingComplete } from "./attribution-tracking";

const touch = (
  overrides: Partial<AttributionTouchpoint> = {},
): AttributionTouchpoint => ({
  gclid: null,
  gbraid: null,
  wbraid: null,
  yclid: null,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  utmContent: null,
  utmTerm: null,
  landingPage: "/ru",
  referrer: null,
  capturedAt: "2026-09-02T00:00:00.000Z",
  ...overrides,
});

const ids = { visitorId: "visitor-test", journeyId: "journey-test" };

test("Yandex first touch survives a later direct visit", () => {
  const yandex = touch({
    yclid: "yandex-click",
    utmSource: "yandex",
    utmMedium: "cpc",
  });
  const first = mergeAttribution(null, yandex, ids);
  const result = mergeAttribution(
    first,
    touch({ landingPage: "/en/trips/a" }),
    ids,
  );
  assert.equal(result.firstTouch.yclid, "yandex-click");
  assert.equal(result.lastTouch.yclid, "yandex-click");
  assert.equal(result.latestLandingPage, "/en/trips/a");
});

test("Google replaces only last touch after a Yandex first touch", () => {
  const first = mergeAttribution(
    null,
    touch({ yclid: "y", utmSource: "yandex", utmMedium: "cpc" }),
    ids,
  );
  const result = mergeAttribution(
    first,
    touch({ gclid: "g", utmSource: "google", utmMedium: "cpc" }),
    ids,
  );
  assert.equal(result.firstTouch.yclid, "y");
  assert.equal(result.lastTouch.gclid, "g");
});

test("a direct first visit does not block the first known marketing touch", () => {
  const direct = mergeAttribution(null, touch(), ids);
  const result = mergeAttribution(
    direct,
    touch({ yclid: "y", utmSource: "yandex", utmMedium: "cpc" }),
    ids,
  );
  assert.equal(result.firstTouch.yclid, "y");
  assert.equal(result.originalLandingPage, "/ru");
});

test("visitor and journey identifiers persist", () => {
  const first = mergeAttribution(null, touch(), ids);
  const result = mergeAttribution(
    first,
    touch({ landingPage: "/ru/trips/b" }),
    {
      visitorId: "new-visitor",
      journeyId: "new-journey",
    },
  );
  assert.equal(result.visitorId, "visitor-test");
  assert.equal(result.journeyId, "journey-test");
});

test("booking_complete is deduplicated by the real booking id", () => {
  const storage = new Map<string, string>();
  const goals: unknown[][] = [];
  const yandex = touch({ yclid: "y", utmSource: "yandex", utmMedium: "cpc" });
  storage.set(
    "karim_attribution_v3",
    JSON.stringify(mergeAttribution(null, yandex, ids)),
  );
  (globalThis as unknown as { window: Record<string, unknown> }).window = {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
    location: { href: "https://karimtor.com/ru", origin: "https://karimtor.com" },
    dataLayer: [],
    ym: (...args: unknown[]) => goals.push(args),
  };
  (globalThis as unknown as { document: Record<string, unknown> }).document = {
    referrer: "",
  };
  assert.equal(
    trackBookingComplete({ bookingId: 123, value: 50, currency: "USD", productId: 1 }),
    true,
  );
  assert.equal(
    trackBookingComplete({ bookingId: 123, value: 50, currency: "USD", productId: 1 }),
    false,
  );
  assert.equal(goals.length, 1);
});
