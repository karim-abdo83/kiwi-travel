import "server-only";
import { api } from "@/trpc/server";
import { env } from "@/env";
import { getTranslations } from "next-intl/server";
import RSS from "rss";

export async function generateRSSFeed(locale: Locale): Promise<string> {
  const trips = await api.trip.listRssFeed(locale);

  const t = await getTranslations({
    locale,
    namespace: "Metadata",
  });

  const feed = new RSS({
    title: t("title"),
    description: t("description"),
    language: locale,
    site_url: env.NEXT_PUBLIC_APP_URL,
    feed_url: `${env.NEXT_PUBLIC_APP_URL}/api/feed-${locale}`.replaceAll(
      "//",
      "/",
    ),
    image_url: `${env.NEXT_PUBLIC_APP_URL}/logo.svg`,
  });

  trips.forEach((trip) => {
    feed.item({
      title: trip.title,
      description: trip.description,
      url: `${env.NEXT_PUBLIC_APP_URL}/${locale}/trips/${trip.id}`.replaceAll(
        "//",
        "/",
      ),
      date: trip.createdAt,
    });
  });

  return feed.xml({ indent: true });
}

export async function generateGoogleFeed(locale: "ru" | "en"): Promise<string> {
  const trips = await api.trip.listRssFeed(locale);

  const itemsXml = trips.map((trip) => {
    const url = `https://${env.NEXT_PUBLIC_APP_URL}/${locale}/trips/${trip.id}`;
    const image = trip.image ?? `https://${env.NEXT_PUBLIC_APP_URL}/logo.svg`;
    const price = trip.price?.toFixed(2) ?? "0.00";

    return `
      <item>
        <g:id>${trip.id}</g:id>
        <g:title><![CDATA[${trip.title}]]></g:title>
        <g:description><![CDATA[${trip.description}]]></description>
        <g:link>${url}</link>
        <g:image_link>${image}</g:image_link>
        <g:price>${price} USD</g:price>
        <g:availability>${trip.inStock ? "in stock" : "out of stock"}</g:availability>
        <g:condition>new</g:condition>
        <g:brand>Karim Tour</g:brand>
        <g:identifier_exists>false</g:identifier_exists>
      </item>
    `;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Karim Tour - Excursions</title>
    <link>https://${env.NEXT_PUBLIC_APP_URL}</link>
    <description>Экскурсии от агентства Karim Tour</description>
    ${itemsXml}
  </channel>
</rss>`;
}

type Locale = "en" | "ru";
