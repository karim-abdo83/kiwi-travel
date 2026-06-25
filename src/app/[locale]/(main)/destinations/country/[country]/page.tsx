import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { api } from "@/trpc/server"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { findCountryBySlug, getCountrySeoKey } from "@/lib/country-slug"
import { localeAttributeFactory } from "@/lib/utils"
import { Link, routing } from "@/i18n/routing"
import { cleanSchema, generateListSchema } from "../../../lib/seo/schemas"

const baseUrl = "https://karimtor.com";

const COUNTRY_DESTINATIONS: Record<string, string[]> = {
  egypt: [
    "hurghada-day-tours",
    "sharm-el-sheikh-day-tours",
    "marsa-alam-day-tours",
    "cairo-day-tours",
    "luxor-day-tours",
    "dahab-day-tours",
    "el-gouna-day-tours",
    "sahl-hasheesh-day-tours",
    "makadi-day-tours",
    "safaga-day-tours"
  ],
  turkey: [
    "istanbul-day-tours",
    "antalya-day-tours",
    "alanya-day-tours",
    "belek-day-tours",
    "kemer-day-tours",
    "side-day-tours",
    "bodrum-day-tours",
    "marmaris-day-tours",
    "fethiye-oludeniz-day-tours",
    "fethiye-and-oludeniz-day-tours"
  ]
}

type Props = {
  params: Promise<{ locale: string; country: string }>
}

export async function generateStaticParams() {
  const countries = ["egypt", "turkey"];
  return routing.locales.flatMap((locale) =>
    countries.map((country) => ({
      locale,
      country
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country } = await params
  if (!COUNTRY_DESTINATIONS[country]) return {}

  const t = await getTranslations({ locale, namespace: "DestinationsPage" })
  const titleKey = `${country}Title` as any

  return {
    title: `${t(titleKey)} | Karim Tour`
  }
}

export default async function CountryDestinationsPage({ params }: Props) {
  const { locale, country: countrySlug } = await params
  setRequestLocale(locale)

  const localeAttribute = localeAttributeFactory(locale)
  const t = await getTranslations({ locale, namespace: "DestinationsPage" })
  const [countries, destinations] = await Promise.all([
    api.country.list(),
    api.destination.list({}),
  ])
  const selectedCountry = findCountryBySlug(countries, countrySlug)
  if (!selectedCountry) {
    notFound()
  }
  const seoKey = getCountrySeoKey(selectedCountry)

  const filteredDestinations = destinations.filter(d => 
    d.countryId === selectedCountry.id
  )

  const priorityDestinations = [
    "sharm-el-sheikh-day-tours",
    "hurghada-day-tours",
    "cairo-day-tours",
    "marsa-alam-day-tours"
  ]

  const sortedDestinations = [
    ...filteredDestinations.filter(d => priorityDestinations.includes(d.slug)),
    ...filteredDestinations.filter(d => !priorityDestinations.includes(d.slug)),
  ]

  // Cargar FAQs del archivo i18n
  const rawFaqs = seoKey
    ? t.raw(`${seoKey}Faqs`) as Array<{ q: string; a: string }>
    : []
  const faqs = Array.isArray(rawFaqs) ? rawFaqs : []

  const seoSlugs = seoKey ? (COUNTRY_DESTINATIONS[seoKey] ?? []) : []
  const seoDestinations = destinations.filter(d => seoSlugs.includes(d.slug))
  const sortedSeoDestinations = [
    ...seoDestinations.filter(d => priorityDestinations.includes(d.slug)),
    ...seoDestinations.filter(d => !priorityDestinations.includes(d.slug)),
  ]

  // Generamos el ItemList Schema (Tours)
  const listSchema = generateListSchema({
    destinations: sortedSeoDestinations.map(d => ({
      name: localeAttribute(d, "name"),
      slug: d.slug,
    })),
    locale,
    baseUrl,
  });

  // Generamos el FAQPage Schema
  const faqSchema = faqs.length > 0 ? {
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  // Combinamos ambos en un grafo limpio para motores de búsqueda (Google)
  const combinedSchema = cleanSchema({
    "@context": "https://schema.org",
    "@graph": [
      listSchema,
      ...(faqSchema ? [faqSchema] : [])
    ]
  });

  const titleKey = seoKey ? `${seoKey}Title` : null
  const seoTextKey = seoKey ? `${seoKey}SeoTextRich` : null
  const pageTitle = titleKey
    ? t(titleKey as any)
    : localeAttribute(selectedCountry, "name")

  // Mapeador de etiquetas de texto enriquecido (Rich Text parsing nativo de next-intl)
  const richTextElements = {
    h2: (chunks: React.ReactNode) => (
      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-white first:mt-0">
        {chunks}
      </h2>
    ),
    h3: (chunks: React.ReactNode) => (
      <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-white">
        {chunks}
      </h3>
    ),
    h4: (chunks: React.ReactNode) => (
      <h4 className="text-lg font-semibold mt-5 mb-2 text-gray-800 dark:text-white">
        {chunks}
      </h4>
    ),
    p: (chunks: React.ReactNode) => (
      <p className="mb-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {chunks}
      </p>
    ),
    // Enlaces dinámicos e internacionalizados
    cairoLink: (chunks: React.ReactNode) => (
      <Link href="/destinations/cairo-day-tours" className="text-primary hover:underline font-semibold mx-1">
        {chunks}
      </Link>
    ),
    gizaLink: (chunks: React.ReactNode) => (
      <Link href="/destinations/cairo-day-tours" className="text-primary hover:underline font-semibold mx-1">
        {chunks}
      </Link>
    ),
    hurghadaLink: (chunks: React.ReactNode) => (
      <Link href="/destinations/hurghada-day-tours" className="text-primary hover:underline font-semibold mx-1">
        {chunks}
      </Link>
    ),
    redSeaLink: (chunks: React.ReactNode) => (
      <Link href="/destinations/hurghada-day-tours" className="text-primary hover:underline font-semibold mx-1">
        {chunks}
      </Link>
    ),
    sharmLink: (chunks: React.ReactNode) => (
      <Link href="/destinations/sharm-el-sheikh-day-tours" className="text-primary hover:underline font-semibold mx-1">
        {chunks}
      </Link>
    ),
    marsaLink: (chunks: React.ReactNode) => (
      <Link href="/destinations/marsa-alam-day-tours" className="text-primary hover:underline font-semibold mx-1">
        {chunks}
      </Link>
    ),
    antalyaLink: (chunks: React.ReactNode) => (
      <Link href="/destinations/antalya-day-tours" className="text-primary hover:underline font-semibold mx-1">
        {chunks}
      </Link>
    ),
    belekLink: (chunks: React.ReactNode) => (
      <Link href="/destinations/belek-day-tours" className="text-primary hover:underline font-semibold mx-1">
        {chunks}
      </Link>
    ),
    kemerLink: (chunks: React.ReactNode) => (
      <Link href="/destinations/kemer-day-tours" className="text-primary hover:underline font-semibold mx-1">
        {chunks}
      </Link>
    ),
    alanyaLink: (chunks: React.ReactNode) => (
      <Link href="/destinations/alanya-day-tours" className="text-primary hover:underline font-semibold mx-1">
        {chunks}
      </Link>
    )
  }

  return (
    <main className="container mx-auto mt-20 px-4 py-8 lg:px-6">
      {seoKey && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(combinedSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}
      
      <div className="mb-6">
        <Link 
          href="/destinations" 
          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
        >
          ← {t("backToAll")}
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">
        {pageTitle}
      </h1>

      {sortedDestinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {sortedDestinations.map((destination) => {
            const isPriority = priorityDestinations.includes(destination.slug)

            return (
              <Link
                key={destination.slug}
                href={`/destinations/${destination.slug}`}
                className="group"
              >
                <article
                  id={`destination-details-id-${destination.id}`}
                  className="relative bg-muted text-card-foreground rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={destination.imageUrl}
                      alt={localeAttribute(destination, "name")}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {isPriority && (
                    <span className="absolute top-2 left-2 z-10 bg-primary text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      ⭐ Popular
                    </span>
                  )}

                  <div className="p-4">
                    <h2 className="text-xl text-center font-semibold">
                      {localeAttribute(destination, "name")}
                    </h2>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 mb-16">
          <p className="text-gray-500">{t("noDestinationsFound")}</p>
        </div>
      )}

      {seoTextKey && (
        <>
          {/* --- SECCIÓN TEXTO SEO ENRIQUECIDO --- */}
          <section className="bg-muted p-6 sm:p-10 rounded-xl max-w-4xl mx-auto border border-border mb-16">
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              {t.rich(seoTextKey as any, richTextElements)}
            </div>
          </section>
        </>
      )}

      {/* --- SECCIÓN ACORDEÓN PREGUNTAS FRECUENTES (FAQs) CON SEO SEMÁNTICO H3 --- */}
      {faqs.length > 0 && (
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
            {t("faqTitle")}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details 
                key={index} 
                className="group border border-border bg-card rounded-lg p-4 [&_summary::-webkit-details-marker]:hidden transition-all duration-300"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900 dark:text-white font-semibold">
                  <h3 className="text-base md:text-lg font-semibold inline">{faq.q}</h3>
                  <span className="shrink-0 rounded-full bg-muted p-1.5 text-gray-900 dark:text-white transition group-open:-rotate-180">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 shrink-0 transition duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300 text-sm md:text-base whitespace-pre-line border-t border-border pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
