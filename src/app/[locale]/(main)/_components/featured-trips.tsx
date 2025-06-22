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
import { localeAttributeFactory } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedTrips() {
  const t = useTranslations("HomePage.featuredTrips");

  const locale = useLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const { data: featuredTrips, isLoading } = api.trip.listFeatured.useQuery();

  return (
    <section className="bg-accent py-16">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center text-3xl font-bold">
          {t("sectionTitle")}
        </h2>
        <Carousel className="sm:px-12">
          <CarouselContent className="p-4 sm:pl-1">
            {isLoading &&
              [1, 2, 3].map((item) => (
                <CarouselItem
                  className="basis-10/12 pl-2 sm:basis-full md:pl-4 lg:basis-1/2 xl:basis-1/3"
                  key={item}
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
                className="basis-10/12 pl-2 sm:basis-full md:pl-4 lg:basis-1/2 xl:basis-1/3"
                key={trip.id}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="p-0">
                    <Image
                      src={trip.image}
                      alt={localeAttribute(trip, "title")}
                      width={300}
                      height={200}
                      className="h-48 w-full object-cover"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="truncate">{localeAttribute(trip, "title")}</CardTitle>
                    {
                      trip.reviewsValue !== 0 ? (
                        <div className="mt-2 flex items-center">
                          <Star className="h-5 w-5 fill-current text-yellow-400" />
                          <span className="ml-1 text-sm">{trip.reviewsValue}</span>
                        </div>
                      ) : <div className="block h-5 mt-2" aria-hidden="true" />
                    }
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-4 pt-0">
                    <span className="text-lg font-bold">${trip.price}</span>
                    <Link href={`/trips/${trip.id}`}>
                      <Button id={`book-trip-outside-id-${trip.id}`} size="sm">{t("buttonLabel")}</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 hidden sm:flex" />
          <CarouselNext className="right-0 hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
