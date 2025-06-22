import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { localeAttributeFactory, mainImage } from "@/lib/utils";
import { api } from "@/trpc/server";
import { PageParams } from "@/types/page-params";
import { ArrowLeft, Clock } from "lucide-react";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: PageParams<{ id: string }>): Promise<Metadata> {
  const { id } = await params;

  const locale = await getLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const destination = await api.trip.listByDestination(Number(id));

  if (!destination) return {};

  const title = `${localeAttribute(destination, "name")} | Karim Tour`;

  return {
    title,
    openGraph: {
      title,
      images: [
        {
          url: destination.imageUrl,
          alt: localeAttribute(destination, "name"),
        },
      ],
    },
  };
}

export default async function DestinationTripsPage({
  params,
}: PageParams<{ id: string }>) {
  const { id } = await params;

  const destination = await api.trip.listByDestination(Number(id));

  if (!destination) return notFound();

  const locale = await getLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const t = await getTranslations("DestinationTripsPage");
  const t_TimeUnits = await getTranslations("General.timeUnits");

  const getLocaleDuration = (duration: string) => {
    return duration
    .replaceAll("days", t_TimeUnits("days"))
    .replaceAll("hours", t_TimeUnits("hours"))
    .replaceAll("day", t_TimeUnits("day"))
    .replaceAll("hour", t_TimeUnits("hour"))
  }

  return (
    <main className="container mx-auto mt-20 px-4 py-8 lg:grid lg:px-0">
      <Link href="/destinations" className="mb-6">
        <Button variant="link">
          <ArrowLeft className="h-4 w-4" />
          {t("backToDestinations")}
        </Button>
      </Link>

      <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl">
        <Image
          src={destination.imageUrl}
          alt={localeAttribute(destination, "name")}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-end bg-black bg-opacity-40">
          <div className="p-6">
            <h1 className="text-4xl font-bold text-white">
              {localeAttribute(destination, "name")}
            </h1>
            <p className="mt-2 text-white text-opacity-90">
              {t("tripsAvailable", { count: destination.trips.length })}
            </p>
          </div>
        </div>
      </div>

      <h2 className="mb-6 text-2xl font-semibold">{t("availableTrips")}</h2>

      {destination.trips.length === 0 ? (
        <p className="text-gray-500">{t("noTripsAvailable")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destination.trips.map((trip) => (
            <Card className="overflow-hidden" key={trip.id}>
              <CardHeader className="relative h-48 w-full">
                <Image
                  src={mainImage(trip.assetsUrls)}
                  alt={localeAttribute(trip, "title")}
                  fill
                  className="object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="truncate text-xl font-semibold">
                  {localeAttribute(trip, "title")}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="size-4" />
                  {getLocaleDuration(trip.duration)}
                </p>
                <p className="mt-2 line-clamp-2">
                  {localeAttribute(trip, "description")}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold">
                    ${Math.floor(trip.adultTripPriceInCents / 100)}
                  </span>
                  <Link href={`/trips/${trip.id}`}>
                    <Button id={`book-trip-outside-id-${trip.id}`}>{t("bookNow")}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}