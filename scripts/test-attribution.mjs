import assert from "node:assert/strict";
import { attributionRecord } from "../src/lib/attribution.ts";

const touch = (overrides) => ({
  gclid: null,
  gbraid: null,
  wbraid: null,
  yclid: null,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  utmContent: null,
  utmTerm: null,
  landingPage: "/en",
  referrer: null,
  capturedAt: "2026-09-02T00:00:00.000Z",
  ...overrides,
});

const google = attributionRecord(
  JSON.stringify({
    firstTouch: touch({
      gclid: "TEST_GCLID",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "tracking_test",
      landingPage: "/en?gclid=TEST_GCLID",
    }),
    lastTouch: touch({
      gclid: "TEST_GCLID",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "tracking_test",
      landingPage: "/en/trips/test",
    }),
    lastLandingPage: "/en/trips/test",
  }),
);
assert.equal(google.gclid, "TEST_GCLID");
assert.equal(google.utmSource, "google");
assert.equal(google.firstTouchSource, "GOOGLE");
assert.equal(google.lastTouchSource, "GOOGLE");

const yandex = attributionRecord(
  JSON.stringify({
    firstTouch: touch({
      yclid: "TEST_YCLID",
      utmSource: "yandex",
      utmMedium: "cpc",
      utmCampaign: "tracking_test",
      landingPage: "/ru?yclid=TEST_YCLID",
    }),
    lastTouch: touch({
      yclid: "TEST_YCLID",
      utmSource: "yandex",
      utmMedium: "cpc",
      utmCampaign: "tracking_test",
      landingPage: "/ru/trips/test",
    }),
    lastLandingPage: "/ru/trips/test",
  }),
);
assert.equal(yandex.yclid, "TEST_YCLID");
assert.equal(yandex.utmSource, "yandex");
assert.equal(yandex.firstTouchSource, "YANDEX");
assert.equal(yandex.lastTouchSource, "YANDEX");

console.log(JSON.stringify({ google, yandex }, null, 2));
