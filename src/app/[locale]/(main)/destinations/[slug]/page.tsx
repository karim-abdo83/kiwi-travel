import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TripCardBadge } from "@/components/trip-card-badge";
import { TripPrice } from "@/components/trip-price";
import { Link } from "@/i18n/routing";
import { localeAttributeFactory, mainImage } from "@/lib/utils";
import { api } from "@/trpc/server";
import { PageParams } from "@/types/page-params";
import { ArrowLeft, Clock } from "lucide-react";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { env } from "@/env";
import { getSeoDescription } from "./helperDescription";
import { 
  getPageExtraContent, 
  getPageIntro, 
  getFaqSchema, 
  PageExtraContent, 
  PageSlug 
} from "./introduction";
import { cleanSchema, generateBreadcrumb, generateDestinationSchema } from "../../lib/seo/schemas";

export async function generateMetadata(
  { params }: PageParams<{ slug: string }>
): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  
  const destination = await api.trip.listByDestination(slug);
  if (!destination) return {};

  const baseUrl = (env.NEXT_PUBLIC_APP_URL || "https://karimtor.com").replace(/\/$/, "");
  const url = `${baseUrl}/${locale}/destinations/${slug}`;

  const localeAttribute = localeAttributeFactory(locale);
  const name = localeAttribute(destination, "name");

  const title = `${name} | Best Trips & Tours`;
  const description = getSeoDescription({
    locale,
    name,
    tripsCount: destination.trips?.length,
  });





  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(["en", "ru", "tr"].map((l) => [l, `${baseUrl}/${l}/destinations/${slug}`])),
    },
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
  const t_TimeUnits = await getTranslations("General.timeUnits");
  const baseUrl = (env.NEXT_PUBLIC_APP_URL || "https://karimtor.com").replace(/\/$/, "");


  // --- Nuevo contenido multidioma y Schema ---
  const intro = getPageIntro({ locale, slug });
  const content = getPageExtraContent({ locale, slug: slug as PageSlug });
  const faqSchema = content ? getFaqSchema(content) : null;


  const destinationSchema = cleanSchema(
  generateDestinationSchema({
    destination: {
      name: localeAttribute(destination, "name"),
      description: intro,
      image: destination.imageUrl,
      slug,
      trips: destination.trips.map(trip => ({
        title: localeAttribute(trip, "title"),
        slug: trip.slug,
      })),
    },
    locale,
    baseUrl,
  })
);

const breadcrumbSchema = cleanSchema(
  generateBreadcrumb([
    { name: "Home", url: `${baseUrl}/${locale}` },
    { name: "Destinations", url: `${baseUrl}/${locale}/destinations` },
    {
      name: localeAttribute(destination, "name"),
      url: `${baseUrl}/${locale}/destinations/${slug}`,
    },
  ])
);

  // Títulos dinámicos para las FAQ según el idioma
  const faqTitles: Record<string, string> = {
    ru: "Часто задаваемые вопросы",
    tr: "Sıkça Sorulan Sorular",
    en: "Frequently Asked Questions"
  };

  const getLocaleDuration = (duration: string) => {
    return duration
      .replaceAll("days", t_TimeUnits("days"))
      .replaceAll("day", t_TimeUnits("day"))
      .replaceAll("hours", t_TimeUnits("hours"))
      .replaceAll("hour", t_TimeUnits("hour"));
  };

  return (
    <main className="container mx-auto md:mt-20 mt-12 lg:mt-20 px-4 py-8 lg:px-6">
      {/* 1. Inyección de Datos Estructurados (Schema.org) */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(destinationSchema).replace(/</g, "\\u003c"),
  }}
/>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
  }}
/>

      {/* Back Button */}
      <Link href="/destinations" className="mb-10 md:mb-0 lg:mb-0">
        <Button variant="link">
          <ArrowLeft className="h-4 w-4" />
          {t("backToDestinations")}
        </Button>
      </Link>

      {/* Banner */}
      <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl mt-2">
        <Image
          src={destination.imageUrl}
          alt={localeAttribute(destination, "name")}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-end bg-black bg-opacity-40">
          <div className="p-6">
            <h1 className="text-4xl font-bold text-white">{localeAttribute(destination, "name")}</h1>
            <p className="mt-2 text-white text-opacity-90">
              {t("tripsAvailable", { count: destination.trips.length })}
            </p>
          </div>
        </div>
      </div>

      {/* Intro */}
      <p className="text-center p-2 mb-6 text-lg text-gray-700 leading-relaxed">
        {intro}
      </p>

      {/* Available Trips */}
      <h2 className="mb-6 text-2xl font-semibold">{t("availableTrips")}</h2>
      {destination.trips.length === 0 ? (
        <p className="text-gray-500">{t("noTripsAvailable")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {destination.trips.map((trip) => (
            <Link
              key={trip.slug}
              href={`/trips/${trip.slug}`}
              className="block transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:shadow-gray-200 dark:hover:shadow-gray-800 rounded-lg overflow-hidden"
            >
              <Card className="h-full">
                <CardHeader className="relative h-48 w-full p-0">
                  <TripCardBadge badge={trip.badge} />
                  <Image
                    src={mainImage(trip.assetsUrls)}
                    alt={localeAttribute(trip, "title")}
                    fill
                    className="object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="text-base font-semibold break-words">{localeAttribute(trip, "title")}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="size-4" />
                    {getLocaleDuration(trip.duration)}
                  </p>
                  <p className="mt-2 line-clamp-2 text-gray-700">{localeAttribute(trip, "description")}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <TripPrice
                      currency={locale === "en" ? "€" : "$"}
                      salePrice={trip.adultTripPriceInCents / 100}
                      originalPrice={
                        trip.originalAdultTripPriceInCents === null
                          ? null
                          : trip.originalAdultTripPriceInCents / 100
                      }
                    />
                    <Button>{t("bookNow")}</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Contenido Extra + FAQ Dinámico */}
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
