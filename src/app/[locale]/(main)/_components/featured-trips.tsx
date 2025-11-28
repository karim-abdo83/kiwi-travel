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

  const { data: featuredTrips, isLoading } = api.trip.listFeatured.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-fixed" style={{
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/feature-trip.jpg)'
    }}>
      <div className="absolute inset-0 -z-10"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl md:text-4xl text-white">
          {t("sectionTitle")}
        </h2>
        <div className="relative">
          <Carousel 
            opts={{
              align: 'start',
              loop: true,
              slidesToScroll: 'auto',
            }}
            className="w-full relative group"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
            {isLoading &&
              [1, 2, 3].map((item) => (
                <CarouselItem
                  key={item}
                  className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
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
                className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Link href={`/trips/${trip.slug}`}>
                  <Card
                    id={`book-trip-outside-id-${trip.id}`}
                    className="overflow-hidden"
                  >
                    <CardHeader className="p-0">
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
                            {trip.reviewsValue}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-2 block h-5" aria-hidden="true" />
                      )}
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4 pt-0">
                      <span className="text-lg font-bold">
                        {locale === 'en' ? '€' : '$'}{trip.price}
                      </span>
                      <Button size="sm">{t("buttonLabel")}</Button>
                    </CardFooter>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
            </CarouselContent>
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 sm:px-4 pointer-events-none">
              <CarouselPrevious className="relative left-0 -translate-x-2 sm:-translate-x-4 pointer-events-auto h-8 w-8 sm:h-10 sm:w-10 bg-background/80 hover:bg-background" />
              <CarouselNext className="relative right-0 translate-x-2 sm:translate-x-4 pointer-events-auto h-8 w-8 sm:h-10 sm:w-10 bg-background/80 hover:bg-background" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
