import Image from "next/image"
import type { Metadata } from "next"
import { api } from "@/trpc/server"
import { getLocale, getTranslations } from "next-intl/server"
import { localeAttributeFactory } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { cleanSchema, generateListSchema } from "../lib/seo/schemas"

const baseUrl = "https://karimtor.com";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DestinationsPage")

  return {
    title: `${t("destinations")} | Karim Tour`
  }
}

export default async function DestinationsPage() {
  const locale = await getLocale()
  const localeAttribute = localeAttributeFactory(locale)
  const t = await getTranslations("DestinationsPage")

  const destinations = await api.destination.list({})

  const priorityDestinations = [
    "sharm-el-sheikh-day-tours",
    "hurghada-day-tours",
    "cairo-day-tours",
    "marsa-alam-day-tours"
  ]

  const sortedDestinations = [
    ...destinations.filter(d => priorityDestinations.includes(d.slug)),
    ...destinations.filter(d => !priorityDestinations.includes(d.slug)),
  ]

  const schema = cleanSchema(
    generateListSchema({
      destinations: sortedDestinations.map(d => ({
        name: localeAttribute(d, "name"),
        slug: d.slug,
      })),
      locale,
      baseUrl,
    })
  );

  return (
    <main className="container mx-auto mt-20 px-4 py-8 lg:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      
      <h1 className="text-3xl font-bold mb-8 text-center">
        {t("destinations")}
      </h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          {t("exploreByCountry")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Link href="/destinations/country/egypt" className="group relative h-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
            <Image 
              src="/egipto.jpg" 
              alt={t("egyptDestinations")}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{t("egypt")}</h3>
              <p className="text-sm text-gray-200 opacity-90 group-hover:translate-x-1 transition-transform duration-300">
                {t("viewEgyptDestinations")} →
              </p>
            </div>
          </Link>

          <Link href="/destinations/country/turkey" className="group relative h-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      
            <Image 
              src="/turqia.jpg" 
              alt={t("turkeyDestinations")}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{t("turkey")}</h3>
              <p className="text-sm text-gray-200 opacity-90 group-hover:translate-x-1 transition-transform duration-300">
                {t("viewTurkeyDestinations")} →
              </p>
            </div>
          </Link>

        </div>
      </section>

      <hr className="border-gray-200 my-10" />

      {/* --- LISTADO GENERAL DE DESTINOS --- */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          {t("allDestinations")}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  {/* IMAGE */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={destination.imageUrl}
                      alt={localeAttribute(destination, "name")}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* BADGE */}
                  {isPriority && (
                    <span className="absolute top-2 left-2 z-10 bg-primary text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      ⭐ Popular
                    </span>
                  )}

                  {/* TITLE */}
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
      </section>
    </main>
  )
}