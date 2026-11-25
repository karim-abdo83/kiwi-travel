import { Link } from "@/i18n/routing";
import { localeAttributeFactory } from "@/lib/utils";
import { api } from "@/trpc/server";
import { PageParams } from "@/types/page-params";
import { ChevronRight } from "lucide-react";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SITE_URL, availableLocales, buildAlternates } from "@/lib/seo/alternates";
import { getDestinationSeo, pickLocale, visibleTrips } from "@/lib/destination-seo";
import { sortByPriority } from "@/lib/destination-seo/sort";
import { toPlainText } from "@/lib/destination-seo/rich-text";
import { RichText } from "@/components/rich-text";
import { getSeoDescription } from "./helperDescription";
import {
  getPageExtraContent,
  getPageIntro,
  getFaqSchema,
  PageSlug
} from "./introduction";
import { cleanSchema, generateBreadcrumb, generateDestinationSchema } from "../../lib/seo/schemas";
import { DestinationTrips } from "./destination-trips";

export async function generateMetadata(
  { params }: PageParams<{ slug: string }>
): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();

  const destination = await api.trip.listByDestination(slug);
  if (!destination) return {};

  const available = availableLocales(destination.nameTr);
  const isUntranslated = locale === "tr" && !available.includes("tr");

  const url = `${SITE_URL}/${locale}/destinations/${slug}`;

  const localeAttribute = localeAttributeFactory(locale);
  const name = localeAttribute(destination, "name");
  const seo = getDestinationSeo(slug);
  const customMeta = pickLocale(seo?.meta, locale);

  const title = customMeta?.title ?? `${name} | Best Trips & Tours`;
  const description =
    customMeta?.description ?? getSeoDescription({ locale, name });

  return {
    // Custom titles already carry the brand, so skip the layout's "| Karim Tour" template.
    title: customMeta ? { absolute: title } : title,
    description,
    alternates: buildAlternates(`/destinations/${slug}`, locale, available),
    ...(isUntranslated ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: destination.imageUrl, alt: name }],
    },
  };
}

export default async function DestinationTripsPage({ params }: PageParams<{ slug: string }>) {
  const { slug } = await params;
  const locale = await getLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const destination = await api.trip.listByDestination(slug);
  if (!destination) return notFound();

  const t = await getTranslations("DestinationTripsPage");
  const baseUrl = SITE_URL;

  // --- Per-destination SEO config (texts, order, season). Missing locale → generic template. ---
  const seo = getDestinationSeo(slug);
  const customMeta = pickLocale(seo?.meta, locale);
  const customIntro = pickLocale(seo?.intro, locale);
  const customFaq = pickLocale(seo?.faq, locale);
  const seasonNotice = seo?.season?.lowSeason ? pickLocale(seo.season.notice, locale) : undefined;
  const seasonChips = seasonNotice
    ? (seo?.season?.chips ?? []).flatMap((chip) => {
        const label = pickLocale(chip.label, locale);
        return label ? [{ slug: chip.slug, label }] : [];
      })
    : [];

  const name = localeAttribute(destination, "name");
  const h1 = customMeta?.h1 ?? name;
  const breadcrumbLabel = pickLocale(seo?.breadcrumbLabel, locale) ?? name;

  const trips = visibleTrips(destination.trips, seo);
  const priorityOptions = { priority: seo?.trips?.priority, off: seo?.trips?.off };

  // --- Generic content (Egypt pages and general cancellation/refund FAQ) ---
  const intro = getPageIntro({ locale, slug });
  const content = getPageExtraContent({ locale, slug: slug as PageSlug });

  const pageUrl = `${baseUrl}/${locale}/destinations/${slug}`;
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: `${baseUrl}/${locale}` },
    { name: t("breadcrumbDestinations"), url: `${baseUrl}/${locale}/destinations` },
    { name: customMeta?.h1 ?? breadcrumbLabel, url: pageUrl },
  ];

  // Destinations with SEO config: one @graph (BreadcrumbList + ItemList + FAQPage) in the page language.
  // Others keep their previous structured data.
  const jsonLdScripts: object[] = seo
    ? [
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: breadcrumbItems.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                item: item.url,
              })),
            },
            {
              "@type": "ItemList",
              name: h1,
              itemListOrder: "https://schema.org/ItemListOrderAscending",
              itemListElement: sortByPriority(trips, priorityOptions).map((trip, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${baseUrl}/${locale}/trips/${trip.slug}`,
                name: localeAttribute(trip, "title"),
              })),
            },
            ...(customFaq
              ? [
                  {
                    "@type": "FAQPage",
                    mainEntity: customFaq.items.map((item) => ({
                      "@type": "Question",
                      name: item.question,
                      acceptedAnswer: { "@type": "Answer", text: toPlainText(item.answer) },
                    })),
                  },
                ]
              : []),
          ],
        },
      ]
    : [
        ...(getFaqSchema(content) ? [getFaqSchema(content)!] : []),
        cleanSchema(
          generateDestinationSchema({
            destination: {
              name,
              description: intro,
              image: destination.imageUrl,
              slug,
              trips: trips.map((trip) => ({
                title: localeAttribute(trip, "title"),
                slug: trip.slug,
              })),
            },
            locale,
            baseUrl,
          })
        ),
        cleanSchema(generateBreadcrumb(breadcrumbItems)),
      ];

  // Títulos dinámicos para las FAQ según el idioma
  const faqTitles: Record<string, string> = {
    ru: "Часто задаваемые вопросы",
    tr: "Sıkça Sorulan Sorular",
    en: "Frequently Asked Questions"
  };

  return (
    <main className="container mx-auto md:mt-20 mt-12 lg:mt-20 px-4 py-8 lg:px-6">
      {jsonLdScripts.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-2 mt-2">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-primary hover:underline">
              {t("breadcrumbHome")}
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
          <li>
            <Link href="/destinations" className="hover:text-primary hover:underline">
              {t("breadcrumbDestinations")}
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
          <li aria-current="page" className="font-medium text-gray-700">
            {breadcrumbLabel}
          </li>
        </ol>
      </nav>

      {/* Banner */}
      <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl mt-2">
        <Image
          src={destination.imageUrl}
          alt={name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-end bg-black bg-opacity-40">
          <div className="p-6">
            <h1 className="text-4xl font-bold text-white">{h1}</h1>
            <p className="mt-2 text-white text-opacity-90">
              {t("tripsAvailable", { count: trips.length })}
            </p>
          </div>
        </div>
      </div>

      {/* Season notice */}
      {seasonNotice && (
        <section className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-medium text-amber-900">{seasonNotice}</p>
          {seasonChips.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {seasonChips.map((chip) => (
                <li key={chip.slug}>
                  <Link
                    href={`/trips/${chip.slug}`}
                    className="inline-block rounded-full border border-amber-300 bg-white px-3 py-1 text-sm font-medium text-amber-900 hover:bg-amber-100"
                  >
                    {chip.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Intro */}
      {customIntro ? (
        <p className="p-2 mb-6 text-lg text-gray-700 leading-relaxed">
          <RichText text={customIntro.lead} strongLinks />
        </p>
      ) : (
        <p className="text-center p-2 mb-6 text-lg text-gray-700 leading-relaxed">
          {intro}
        </p>
      )}

      {/* Available Trips */}
      <h2 className="mb-6 text-2xl font-semibold">{t("availableTrips")}</h2>
      <DestinationTrips
        trips={trips}
        locale={locale}
        priority={seo?.trips?.priority}
        offSlugs={seo?.trips?.off}
        lastTripTypes={seo?.season?.lowSeason ? seo.season.lastTripTypes : undefined}
      />

      {/* Full intro text */}
      {customIntro && customIntro.body.length > 0 && (
        <section className="mb-12 space-y-4 text-lg text-gray-700 leading-relaxed">
          {customIntro.body.map((paragraph, index) => (
            <p key={index}>
              <RichText text={paragraph} strongLinks />
            </p>
          ))}
        </section>
      )}

      {/* Destination FAQ: answers are in the server HTML (native <details>, no JS needed) */}
      {customFaq && customFaq.items.length > 0 && (
        <section className="mb-12 bg-white p-6 rounded-lg shadow-md border border-primary/10">
          <h2 className="text-2xl font-semibold mb-6">{customFaq.title}</h2>
          <div className="space-y-3">
            {customFaq.items.map((item) => (
              <details
                key={item.question}
                className="group rounded-lg border border-gray-100 bg-gray-50/50 p-4 shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-gray-800">
                  <h3>{item.question}</h3>
                  <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  <RichText text={item.answer} />
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Contenido Extra + FAQ genérico */}
      {content && (
        <div className="space-y-12 mb-12">
          {content.sections.map((section) => (
            <section key={section.title} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">{section.title}</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          {content.faq.length > 0 && (
            <section className="bg-white p-6 rounded-lg shadow-md border border-primary/10">
              <h2 className="text-2xl font-semibold mb-6">
                {faqTitles[locale] || faqTitles.en}
              </h2>
              <div className="space-y-6">
                {content.faq.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 shadow-sm transition-colors hover:bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.question}</h3>
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
