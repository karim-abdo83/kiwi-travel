import Image from "next/image";
import type { Metadata } from "next";
import { PLACEHOLDER_IMAGE } from "@/constants";
import { api } from "@/trpc/server";
import { getLocale, getTranslations } from "next-intl/server";
import { getCountrySlug } from "@/lib/country-slug";
import { localeAttributeFactory } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { cleanSchema, generateListSchema } from "../lib/seo/schemas";

const baseUrl = "https://karimtor.com";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DestinationsPage");

  return {
    title: `${t("destinations")} | Karim Tour`,
  };
}

export default async function DestinationsPage() {
  const locale = await getLocale();
  const localeAttribute = localeAttributeFactory(locale);
  const t = await getTranslations("DestinationsPage");

  const [countries, destinations] = await Promise.all([
    api.country.list(),
    api.destination.list({}),
  ]);

  const priorityDestinations = [
    "sharm-el-sheikh-day-tours",
    "hurghada-day-tours",
    "cairo-day-tours",
    "marsa-alam-day-tours",
  ];

  const sortedDestinations = [
    ...destinations.filter((d) => priorityDestinations.includes(d.slug)),
    ...destinations.filter((d) => !priorityDestinations.includes(d.slug)),
  ];
  const sortedCountries = [...countries].sort((a, b) =>
    localeAttribute(a, "name").localeCompare(
      localeAttribute(b, "name"),
      locale,
    ),
  );

  const schema = cleanSchema(
    generateListSchema({
      destinations: sortedDestinations.map((d) => ({
        name: localeAttribute(d, "name"),
        slug: d.slug,
      })),
      locale,
      baseUrl,
    }),
  );

  return (
    <main className="container mx-auto mt-20 px-4 py-8 lg:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <h1 className="mb-8 text-center text-3xl font-bold">
        {t("destinations")}
      </h1>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
          {t("exploreByCountry")}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sortedCountries.map((country) => {
            const countryName = localeAttribute(country, "name");
            const countryImage =
              destinations.find(
                (destination) => destination.countryId === country.id,
              )?.imageUrl ?? PLACEHOLDER_IMAGE;

            return (
              <Link
                key={country.id}
                href={`/destinations/country/${getCountrySlug(country.nameEn)}`}
                className="group relative h-64 overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                <Image
                  src={countryImage}
                  alt={t("countryDestinations", { country: countryName })}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    {countryName}
                  </h3>
                  <p className="text-sm text-gray-200 opacity-90 transition-transform duration-300 group-hover:translate-x-1">
                    {t("viewCountryDestinations", { country: countryName })} →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <hr className="my-10 border-gray-200" />

      {/* --- LISTADO GENERAL DE DESTINOS --- */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
          {t("allDestinations")}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                  {/* IMAGE */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={destination.imageUrl}
                      alt={localeAttribute(destination, "name")}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* BADGE */}
                  {isPriority && (
                    <span className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs text-white">
                      ⭐ Popular
                    </span>
                  )}

                  {/* TITLE */}
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
      </section>
    </main>
  );
}
