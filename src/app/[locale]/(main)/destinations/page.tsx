import Image from "next/image"
import type { Metadata } from "next"
import { api } from "@/trpc/server"
import { getLocale, getTranslations } from "next-intl/server"
import { localeAttributeFactory } from "@/lib/utils"
import { Link } from "@/i18n/routing"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DestinationsPage")

  return {
    title: `${t("destinations")} | Karim Tour`
  }
}

export default async function DestinationsPage() {
  const locale = await getLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const t = await getTranslations("DestinationsPage")

  const destinations = await api.destination.list({});

  return (
    <main className="container mx-auto mt-20 px-4 py-8 lg:grid lg:px-0">
      <h1 className="text-3xl font-bold mb-8 text-center">{t("destinations")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {destinations.map((destination) => (
          <Link key={destination.id} href={`/destinations/${destination.id}`} className="group">
            <article id={`destination-details-id-${destination.id}`} className="bg-muted text-card-foreground rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="relative h-48 w-full">
                <Image
                  src={destination.imageUrl}
                  alt={localeAttribute(destination, "name")}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl text-center font-semibold">{localeAttribute(destination, "name")}</h2>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  )
}
