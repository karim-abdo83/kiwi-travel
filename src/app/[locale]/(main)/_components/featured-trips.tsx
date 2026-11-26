"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { api } from "@/trpc/react";
import { formatRating, localeAttributeFactory } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { TripCardBadge } from "@/components/trip-card-badge";
import { TripPrice } from "@/components/trip-price";

export default function FeaturedTrips() {
  const t = useTranslations("HomePage.featuredTrips");

  const locale = useLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const { data: featuredTrips, isLoading } = api.trip.listFeatured.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <section
      className="relative bg-cover bg-fixed bg-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/feature-trip.jpg)",
      }}
    >
      <div className="absolute inset-0 -z-10"></div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          {t("sectionTitle")}
        </h2>
        <p className="mb-8 text-center text-white">{t("description")}</p>
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: "auto",
            }}
            className="group relative w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {isLoading &&
                [1, 2, 3].map((item) => (
                  <CarouselItem
                    key={item}
                    className="basis-full pl-2 sm:basis-1/2 sm:pl-4 lg:basis-1/3 xl:basis-1/4"
                  >
                    <Card className="overflow-hidden">
                      <CardHeader className="p-0">
                        <Skeleton className="h-48 w-full object-cover" />
                      </CardHeader>
                      <CardContent className="p-4">
                        <Skeleton
                          className="select-none font-semibold leading-none tracking-tight text-transparent"
                          aria-hidden="true"
                        >
                          Test Title
                        </Skeleton>
                        <div className="mt-2 flex items-center">
                          <Star className="h-5 w-5 fill-current text-muted" />
                          <Skeleton
                            className="ml-1 select-none text-sm text-transparent"
                            aria-hidden="true"
                          >
                            4.7
                          </Skeleton>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between p-4 pt-0">
                        <Skeleton
                          className="select-none text-lg font-bold text-transparent"
                          aria-hidden="true"
                        >
                          $100
                        </Skeleton>
                        <Skeleton
                          className="h-8 select-none rounded-md px-3 text-xs text-transparent"
                          aria-hidden="true"
                        >
                          {t("buttonLabel")}
                        </Skeleton>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              {featuredTrips?.map((trip) => (
                <CarouselItem
                  key={trip.id}
                  className="basis-full pl-2 sm:basis-1/2 sm:pl-4 lg:basis-1/3 xl:basis-1/4"
                >
                  <Link href={`/trips/${trip.slug}`}>
                    <Card
                      id={`book-trip-outside-id-${trip.id}`}
                      className="overflow-hidden"
                    >
                      <CardHeader className="relative p-0">
                        <TripCardBadge badge={trip.badge} />
                        <Image
                          src={trip.image}
                          alt={localeAttribute(trip, "title")}
                          width={300}
                          height={200}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                          decoding="async"
                          className="h-48 w-full object-cover"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="truncate">
                          {localeAttribute(trip, "title")}
                        </CardTitle>
                        {trip.reviewsValue !== 0 ? (
                          <div className="mt-2 flex items-center">
                            <Star className="h-5 w-5 fill-current text-yellow-400" />
                            <span className="ml-1 text-sm">
                              {formatRating(trip.reviewsValue)}
                            </span>
                          </div>
                        ) : (
                          <div className="mt-2 block h-5" aria-hidden="true" />
                        )}
                      </CardContent>
                      <CardFooter className="flex items-center justify-between p-4 pt-0">
                        <TripPrice
                          currency={
                            locale === "en" || locale === "de" ? "€" : "$"
                          }
                          salePrice={
                            locale === "en" || locale === "de"
                              ? trip.englishPrice
                              : trip.price
                          }
                          originalPrice={
                            locale === "en" || locale === "de"
                              ? null
                              : trip.originalPrice
                          }
                        />
                        <Button size="sm">{t("buttonLabel")}</Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 flex -translate-y-1/2 justify-between px-2 sm:px-4">
              <CarouselPrevious className="pointer-events-auto relative left-0 h-8 w-8 -translate-x-2 bg-background/80 hover:bg-background sm:h-10 sm:w-10 sm:-translate-x-4" />
              <CarouselNext className="pointer-events-auto relative right-0 h-8 w-8 translate-x-2 bg-background/80 hover:bg-background sm:h-10 sm:w-10 sm:translate-x-4" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
