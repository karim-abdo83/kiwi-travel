import { TripPrice } from "@/components/trip-price";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { mainImage } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/react";
import Image from "next/image";
import type { CleanTripDefinition } from "../_data/western-turkey-excursions";

type Destination = NonNullable<RouterOutputs["trip"]["listByDestination"]>;

interface CleanExcursionCardsProps {
  destination: Destination;
  trips: readonly CleanTripDefinition[];
  originLabel: string;
  heading: string;
  headingId: string;
}

export function CleanExcursionCards({
  destination,
  trips,
  originLabel,
  heading,
  headingId,
}: CleanExcursionCardsProps) {
  const tripsBySlug = new Map(
    destination.trips.map((trip) => [trip.slug, trip]),
  );
  const allowedTrips = trips
    .map(({ slug, title }) => {
      const trip = tripsBySlug.get(slug);
      return trip ? { ...trip, displayTitle: title } : null;
    })
    .filter((trip): trip is NonNullable<typeof trip> => trip !== null);

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="mb-6 text-2xl font-semibold">
        {heading}
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {allowedTrips.map((trip) => (
          <Link
            key={trip.slug}
            href={`/trips/${trip.slug}`}
            className="block overflow-hidden rounded-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-800"
          >
            <Card className="h-full">
              <CardHeader className="relative h-48 w-full p-0">
                <Image
                  src={mainImage(trip.assetsUrls)}
                  alt={trip.displayTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                  {originLabel}
                </p>
                <h3 className="break-words text-base font-semibold">
                  {trip.displayTitle}
                </h3>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <TripPrice
                    currency="€"
                    salePrice={
                      (trip.englishAdultTripPriceInCents ??
                        trip.adultTripPriceInCents) / 100
                    }
                    originalPrice={null}
                  />
                  <Button>Book Now</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
