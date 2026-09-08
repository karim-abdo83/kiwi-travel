import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TripPrice } from "@/components/trip-price";
import { env } from "@/env";
import { Link } from "@/i18n/routing";
import { mainImage } from "@/lib/utils";
import { api } from "@/trpc/server";
import type { PageParams } from "@/types/page-params";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

const BELEK_DESTINATION_SLUG = "belek-day-tours";

const BELEK_TRIPS = [
  {
    title: "5-in-1 Adventure",
    slug: "belek-combo-rafting-zipline-canyon-atvbuggy-lunch",
  },
  {
    title: "Paragliding from Belek",
    slug: "belek-tandem-paragliding-from-700m-with-hotel-pickup",
  },
  {
    title: "Cappadocia 2-Day Tour",
    slug: "cappadocia-2-day-tour-from-belek",
  },
  {
    title: "Demre Myra Kekova",
    slug: "from-belek-excursion-to-demre-myra-kekova-sunken-city-with-lunch-transfer",
  },
  {
    title: "Rafting Adventure",
    slug: "belek-whitewater-rafting-adventure-in-kprl-canyon",
  },
  { title: "Green Canyon", slug: "green-canyon-tour-from-belek" },
  {
    title: "Scuba Diving",
    slug: "belek-scuba-diving-with-pickup-lunch-and-2-dives",
  },
  {
    title: "Quad Safari",
    slug: "belek-quad-safari-experience-with-free-hotel-transfer",
  },
  {
    title: "Monster Pirate Boat",
    slug: "belek-gonster-pirate-ship-with-foam-party-free-lunchdrinks-and-swim-breaks",
  },
  {
    title: "Mega Star Yacht",
    slug: "belek-megastar-catamaran-cruise-with-foam-party-free-lunch-and-swim-breaks",
  },
  {
    title: "Suluada Island",
    slug: "belek-suluada-island-boat-trip-with-lunch-hotel-pickup",
  },
  {
    title: "Turkish Bath",
    slug: "belek-turkish-bath-with-peeling-foam-and-oil-massage",
  },
  {
    title: "Tazi Canyon & Selge",
    slug: "from-belek-tazi-canyon-selge-ancient-city-tour-wlunch",
  },
  {
    title: "Antalya City Tour",
    slug: "from-belek-antalya-old-city-tour-waterfall-boat-lunch",
  },
  {
    title: "Pamukkale & Salda",
    slug: "from-belek-pamukkale-and-salda-lake-day-trip-all-inclusive",
  },
] as const;

const pageTitle = "Belek Excursions & Tours | Karim Tour";
const pageDescription =
  "Book Belek excursions, boat trips, rafting, canyon tours and adventures with hotel pickup and clear prices.";

export async function generateMetadata({
  params,
}: PageParams<{ locale: string }>): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = (env.NEXT_PUBLIC_APP_URL || "https://karimtor.com").replace(
    /\/$/,
    "",
  );
  const url = `${baseUrl}/en/google-ads/belek-excursions`;

  if (locale !== "en") return {};

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: url },
    robots: { index: false, follow: true },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "website",
      url,
    },
  };
}

export default async function BelekExcursionsAdsPage({
  params,
}: PageParams<{ locale: string }>) {
  const { locale } = await params;
  if (locale !== "en") notFound();

  const destination = await api.trip.listByDestination(BELEK_DESTINATION_SLUG);
  if (!destination) notFound();

  const tripsBySlug = new Map(
    destination.trips.map((trip) => [trip.slug, trip]),
  );
  const trips = BELEK_TRIPS.map(({ slug, title }) => {
    const trip = tripsBySlug.get(slug);
    return trip ? { ...trip, title } : null;
  }).filter((trip): trip is NonNullable<typeof trip> => trip !== null);

  return (
    <main className="container mx-auto px-4 py-12 md:mt-20 md:py-16 lg:px-6">
      <section className="mx-auto mb-10 max-w-4xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Belek Excursions &amp; Tours
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
          Book the best excursions from Belek with clear prices, hotel pickup
          and easy online booking.
        </p>
      </section>

      <section aria-labelledby="belek-tours-heading">
        <h2 id="belek-tours-heading" className="mb-6 text-2xl font-semibold">
          Tours available from Belek
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {trips.map((trip) => (
            <Link
              key={trip.slug}
              href={`/trips/${trip.slug}`}
              className="block overflow-hidden rounded-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-800"
            >
              <Card className="h-full">
                <CardHeader className="relative h-48 w-full p-0">
                  <Image
                    src={mainImage(trip.assetsUrls)}
                    alt={trip.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="break-words text-base font-semibold">
                    {trip.title}
                  </h3>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <TripPrice
                      currency="€"
                      salePrice={trip.adultTripPriceInCents / 100}
                      originalPrice={
                        trip.originalAdultTripPriceInCents === null
                          ? null
                          : trip.originalAdultTripPriceInCents / 100
                      }
                    />
                    <Button>Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
