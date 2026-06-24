import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { findCountryBySlug, getCountrySeoKey } from "@/lib/country-slug";
import { localeAttributeFactory } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { cleanSchema, generateListSchema } from "../../../lib/seo/schemas";

const baseUrl = "https://karimtor.com";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; country: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country: countrySlug } = await params;
  const countries = await api.country.list();
  const country = findCountryBySlug(countries, countrySlug);
  if (!country) return {};

  const t = await getTranslations({ locale, namespace: "DestinationsPage" });
  const localeAttribute = localeAttributeFactory(locale);
  const countryName = localeAttribute(country, "name");
  const seoKey = getCountrySeoKey(country);
  const title = seoKey
    ? t(`${seoKey}Title`)
    : t("genericCountryTitle", { country: countryName });

  return {
    title: `${title} | Karim Tour`,
  };
}

export default async function CountryDestinationsPage({ params }: Props) {
  const { locale, country: countrySlug } = await params;
  setRequestLocale(locale);

  const localeAttribute = localeAttributeFactory(locale);
  const t = await getTranslations({ locale, namespace: "DestinationsPage" });
  const [countries, destinations] = await Promise.all([
    api.country.list(),
    api.destination.list({}),
  ]);
  const country = findCountryBySlug(countries, countrySlug);
  if (!country) notFound();

  const filteredDestinations = destinations.filter(
    (destination) => destination.countryId === country.id,
  );
  const countryName = localeAttribute(country, "name");
  const seoKey = getCountrySeoKey(country);

  const priorityDestinations = [
    "sharm-el-sheikh-day-tours",
    "hurghada-day-tours",
    "cairo-day-tours",
    "marsa-alam-day-tours",
  ];

  const sortedDestinations = [
    ...filteredDestinations.filter((d) =>
      priorityDestinations.includes(d.slug),
    ),
    ...filteredDestinations.filter(
      (d) => !priorityDestinations.includes(d.slug),
    ),
  ];

  // Cargar FAQs del archivo i18n
  const rawFaqs = seoKey
    ? (t.raw(`${seoKey}Faqs`) as Array<{ q: string; a: string }>)
    : [];
  const faqs = Array.isArray(rawFaqs) ? rawFaqs : [];

  // Generamos el ItemList Schema (Tours)
  const listSchema = generateListSchema({
    destinations: sortedDestinations.map((d) => ({
      name: localeAttribute(d, "name"),
      slug: d.slug,
    })),
    locale,
    baseUrl,
  });

  // Generamos el FAQPage Schema
  const faqSchema =
    faqs.length > 0
      ? {
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }
      : null;

  // Combinamos ambos en un grafo limpio para motores de búsqueda (Google)
  const combinedSchema = cleanSchema({
    "@context": "https://schema.org",
    "@graph": [listSchema, ...(faqSchema ? [faqSchema] : [])],
  });

  const pageTitle = seoKey
    ? t(`${seoKey}Title`)
    : t("genericCountryTitle", { country: countryName });

  // Mapeador de etiquetas de texto enriquecido (Rich Text parsing nativo de next-intl)
  const richTextElements = {
    h2: (chunks: React.ReactNode) => (
      <h2 className="mb-4 mt-8 text-2xl font-bold text-gray-800 first:mt-0 dark:text-white">
        {chunks}
      </h2>
    ),
    h3: (chunks: React.ReactNode) => (
      <h3 className="mb-3 mt-6 text-xl font-bold text-gray-800 dark:text-white">
        {chunks}
      </h3>
    ),
    h4: (chunks: React.ReactNode) => (
      <h4 className="mb-2 mt-5 text-lg font-semibold text-gray-800 dark:text-white">
        {chunks}
      </h4>
    ),
    p: (chunks: React.ReactNode) => (
      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {chunks}
      </p>
    ),
    // Enlaces dinámicos e internacionalizados
    cairoLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/cairo-day-tours"
        className="mx-1 font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    gizaLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/cairo-day-tours"
        className="mx-1 font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    hurghadaLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/hurghada-day-tours"
        className="mx-1 font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    redSeaLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/hurghada-day-tours"
        className="mx-1 font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    sharmLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/sharm-el-sheikh-day-tours"
        className="mx-1 font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    marsaLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/marsa-alam-day-tours"
        className="mx-1 font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    antalyaLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/antalya-day-tours"
        className="mx-1 font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    belekLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/belek-day-tours"
        className="mx-1 font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    kemerLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/kemer-day-tours"
        className="mx-1 font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    alanyaLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/alanya-day-tours"
        className="mx-1 font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
  };

  return (
    <main className="container mx-auto mt-20 px-4 py-8 lg:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mb-6">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          ← {t("backToAll")}
        </Link>
      </div>

      <h1 className="mb-8 text-center text-3xl font-bold">{pageTitle}</h1>

      {sortedDestinations.length > 0 ? (
        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedDestinations.map((destination) => {
            const isPriority = priorityDestinations.includes(destination.slug);

            return (
              <Link
                key={destination.slug}
                href={`/destinations/${destination.slug}`}
                className="group"
              >
                <article
                  id={`destination-details-id-${destination.id}`}
                  className="relative h-full overflow-hidden rounded-lg bg-muted text-card-foreground shadow-md transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={destination.imageUrl}
                      alt={localeAttribute(destination, "name")}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {isPriority && (
                    <span className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs text-white">
                      ⭐ Popular
                    </span>
                  )}

                  <div className="p-4">
                    <h2 className="text-center text-xl font-semibold">
                      {localeAttribute(destination, "name")}
                    </h2>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mb-16 py-12 text-center">
          <p className="text-gray-500">{t("noDestinationsFound")}</p>
        </div>
      )}

      {/* --- SECCIÓN TEXTO SEO ENRIQUECIDO --- */}
      {seoKey ? (
        <section className="mx-auto mb-16 max-w-4xl rounded-xl border border-border bg-muted p-6 sm:p-10">
          <div className="prose max-w-none text-gray-600 dark:prose-invert dark:text-gray-300">
            {t.rich(`${seoKey}SeoTextRich`, richTextElements)}
          </div>
        </section>
      ) : (
        <section className="mx-auto mb-16 max-w-4xl rounded-xl border border-border bg-muted p-6 sm:p-10">
          <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
            {t("genericCountryHeading", { country: countryName })}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {t("genericCountryDescription", { country: countryName })}
          </p>
        </section>
      )}

      {/* --- SECCIÓN ACORDEÓN PREGUNTAS FRECUENTES (FAQs) CON SEO SEMÁNTICO H3 --- */}
      {faqs.length > 0 && (
        <section className="mx-auto mb-16 max-w-4xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
            {t("faqTitle")}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-lg border border-border bg-card p-4 transition-all duration-300 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-semibold text-gray-900 dark:text-white">
                  <h3 className="inline text-base font-semibold md:text-lg">
                    {faq.q}
                  </h3>
                  <span className="shrink-0 rounded-full bg-muted p-1.5 text-gray-900 transition group-open:-rotate-180 dark:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 shrink-0 transition duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 whitespace-pre-line border-t border-border pt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 md:text-base">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
