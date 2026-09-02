import { index, jsonb, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import type { AttributionTouchpoint } from "@/lib/attribution";

export const contactClick = pgTable(
  "contact_clicks",
  (c) => ({
    id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    eventId: c.uuid("event_id").notNull(),
    channel: c.text("channel", { enum: ["whatsapp", "telegram"] }).notNull(),
    pagePath: c.text("page_path").notNull(),
    ctaLocation: c.text("cta_location"),
    tripId: c.integer("trip_id"),
    resort: c.text("resort"),
    visitorId: c.text("visitor_id"),
    journeyId: c.text("journey_id"),
    gclid: c.text("gclid"),
    gbraid: c.text("gbraid"),
    wbraid: c.text("wbraid"),
    yclid: c.text("yclid"),
    utmSource: c.text("utm_source"),
    utmMedium: c.text("utm_medium"),
    utmCampaign: c.text("utm_campaign"),
    utmContent: c.text("utm_content"),
    utmTerm: c.text("utm_term"),
    utmAdgroup: c.text("utm_adgroup"),
    utmAd: c.text("utm_ad"),
    firstTouch: jsonb("first_touch").$type<AttributionTouchpoint>(),
    lastTouch: jsonb("last_touch").$type<AttributionTouchpoint>(),
    originalLandingPage: c.text("original_landing_page"),
    currentLandingPage: c.text("current_landing_page"),
    initialReferrer: c.text("initial_referrer"),
    latestReferrer: c.text("latest_referrer"),
    clickedAt: c
      .timestamp("clicked_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  }),
  (t) => [
    uniqueIndex("contact_click_event_id_uidx").on(t.eventId),
    index("contact_click_journey_id_idx").on(t.journeyId),
    index("contact_click_visitor_id_idx").on(t.visitorId),
    index("contact_click_clicked_at_idx").on(t.clickedAt),
  ],
);
