"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/i18n/routing";
import { formatRating, localeAttributeFactory, mainImage } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/react";
import { Clock, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";

type Destination = NonNullable<RouterOutputs["trip"]["listByDestination"]>;
type SortOption = "recommended" | "rating" | "price-asc" | "price-desc";

interface DestinationTripsProps {
  trips: Destination["trips"];
  locale: string;
}

export function DestinationTrips({ trips, locale }: DestinationTripsProps) {
  const t = useTranslations("DestinationTripsPage");
  const tTimeUnits = useTranslations("General.timeUnits");
  const localeAttribute = localeAttributeFactory(locale);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("recommended");

  const tripTypes = useMemo(() => {
    const typesById = new Map<
      number,
      Destination["trips"][number]["tripTypes"][number]["tripType"]
    >();

    trips.forEach((trip) => {
      trip.tripTypes.forEach(({ tripType }) => {
        typesById.set(tripType.id, tripType);
      });
    });

    return Array.from(typesById.values());
  }, [trips]);

  const visibleTrips = useMemo(() => {
    const originalOrder = new Map(trips.map((trip, index) => [trip.id, index]));
    const filteredTrips =
      selectedTypeId === null
        ? trips
        : trips.filter((trip) =>
            trip.tripTypes.some(
              ({ tripType }) => tripType.id === selectedTypeId,
            ),
          );

    return [...filteredTrips].sort((a, b) => {
      switch (sortOption) {
        case "rating":
          return (
            b.reviewsValue - a.reviewsValue ||
            (originalOrder.get(a.id) ?? 0) - (originalOrder.get(b.id) ?? 0)
          );
        case "price-asc":
          return (
            a.adultTripPriceInCents - b.adultTripPriceInCents ||
            (originalOrder.get(a.id) ?? 0) - (originalOrder.get(b.id) ?? 0)
          );
        case "price-desc":
          return (
            b.adultTripPriceInCents - a.adultTripPriceInCents ||
            (originalOrder.get(a.id) ?? 0) - (originalOrder.get(b.id) ?? 0)
          );
        case "recommended":
          return (
            Number(b.isFeatured) - Number(a.isFeatured) ||
            (originalOrder.get(a.id) ?? 0) - (originalOrder.get(b.id) ?? 0)
          );
        default:
          return (originalOrder.get(a.id) ?? 0) - (originalOrder.get(b.id) ?? 0);
      }
    });
  }, [selectedTypeId, sortOption, trips]);

  const getLocaleDuration = (duration: string) =>
    duration
      .replaceAll("days", tTimeUnits("days"))
      .replaceAll("day", tTimeUnits("day"))
      .replaceAll("hours", tTimeUnits("hours"))
      .replaceAll("hour", tTimeUnits("hour"));

  if (trips.length === 0) {
    return <p className="text-gray-500">{t("noTripsAvailable")}</p>;
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={selectedTypeId === null ? "default" : "outline"}
            size="sm"
            aria-pressed={selectedTypeId === null}
            onClick={() => setSelectedTypeId(null)}
          >
            {t("allTripTypes")}
          </Button>
          {tripTypes.map((tripType) => (
            <Button
              key={tripType.id}
              type="button"
              variant={selectedTypeId === tripType.id ? "default" : "outline"}
              size="sm"
              aria-pressed={selectedTypeId === tripType.id}
              onClick={() => setSelectedTypeId(tripType.id)}
            >
              {localeAttribute(tripType, "name")}
            </Button>
          ))}
        </div>

        <div className="w-full md:w-56">
          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value as SortOption)}
          >
            <SelectTrigger aria-label={t("sortBy")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">{t("sortRecommended")}</SelectItem>
              <SelectItem value="rating">{t("sortHighestRating")}</SelectItem>
              <SelectItem value="price-asc">{t("sortLowestPrice")}</SelectItem>
              <SelectItem value="price-desc">{t("sortHighestPrice")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {visibleTrips.length === 0 ? (
        <p className="mb-12 text-gray-500">{t("noMatchingTrips")}</p>
      ) : (
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {visibleTrips.map((trip) => (
            <Link
              key={trip.slug}
              href={`/trips/${trip.slug}`}
              className="block overflow-hidden rounded-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-800"
            >
              <Card className="h-full">
                <CardHeader className="relative h-48 w-full p-0">
                  <Image
                    src={mainImage(trip.assetsUrls)}
                    alt={localeAttribute(trip, "title")}
                    fill
                    className="object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="break-words text-base font-semibold">
                    {localeAttribute(trip, "title")}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="size-4" />
                    {getLocaleDuration(trip.duration)}
                  </p>
                  {trip.reviewsCount > 0 && (
                    <p className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {formatRating(trip.reviewsValue)} ({t("reviewCount", {
                          count: trip.reviewsCount,
                        })})
                      </span>
                    </p>
                  )}
                  <p className="mt-2 line-clamp-2 text-gray-700">
                    {localeAttribute(trip, "description")}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold">
                      {locale === "en" ? "€" : "$"}
                      {Math.floor(trip.adultTripPriceInCents / 100)}
                    </span>
                    <Button>{t("bookNow")}</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
