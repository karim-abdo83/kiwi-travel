import { AssetGallery } from "@/components/asset-gallery";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { env } from "@/env";
import { localeAttributeFactory, mainImage } from "@/lib/utils";
import { api } from "@/trpc/server";
import { PageParams } from "@/types/page-params";
import { format } from "date-fns";
import {
  BanknoteX,
  BookCheck,
  Car,
  Check,
  CircleDollarSign,
  FacebookIcon,
  InstagramIcon,
  MapPin,
  MessageSquare,
  Send,
  Clock,
  Calendar,
  UsersIcon,
} from "lucide-react";
import { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { TouristTrip, WithContext } from "schema-dts";
import BookingForm from "./_components/booking-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReviewWriteForm } from "../../_components/reviewWrite-form";
import Testimonials from "../../_components/testimonials";
import { ensureLengthRange } from "../helperSEO";
import { cleanSchema, generateBreadcrumb, generateTripSchema } from "../../lib/seo/schemas";

export async function generateMetadata({
  params,
}: PageParams<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const trip = await api.trip.viewBySlug(slug);
  if (!trip) return {};

  const rawTitle = localeAttribute(trip, "title");

  const title = ensureLengthRange(
    rawTitle,
    50,
    65,
    "Karim Tour",
  );

  const baseDescription =
    locale === "en"
      ? `Discover ${rawTitle} in ${localeAttribute(
          trip.destination,
          "name",
        )}. Prices, duration, itinerary and instant booking.`
      : locale === "ru"
      ? `Откройте тур "${rawTitle}" в ${localeAttribute(
          trip.destination,
          "name",
        )}. Программа, цены и онлайн-бронирование.`
      : `${rawTitle} turunu ${localeAttribute(
          trip.destination,
          "name",
        )} bölgesinde keşfedin. Program, fiyatlar ve online rezervasyon.`;

  const description = ensureLengthRange(
    baseDescription,
    140,
    165,
    locale === "en"
      ? "Travel with Karim Tour."
      : locale === "ru"
      ? "Путешествуйте с Karim Tour." 
      : "Karim Tour ile seyahat edin."
  );


let seoDescription =
  locale === "en"
    ? trip.descriptionEn
    : locale === "ru"
    ? trip.descriptionRu
    : trip.descriptionTr;

if (!seoDescription || seoDescription.length < 130 || seoDescription.length > 165) {
  seoDescription = description;
}

  return {
     title: {
    absolute: title, 
  },
    description: seoDescription,
    alternates: {
      canonical: `/${locale}/trips/${slug}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}/trips/${slug}`]),
      ),
    },
    openGraph: {
      title,
      description: seoDescription,
      url: `/${locale}/trips/${slug}`,
      images: [
        {
          url: mainImage(trip.assetsUrls),
          alt: title,
        },
      ],
    },
  };
}



export default async function TripDetailsPage({
  params,
}: PageParams<{ slug: string }>) {
  const { slug } = await params;

  const locale = await getLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const t = await getTranslations("TripDetailsPage");
  const t_Amenities = await getTranslations("General.amenities");
  const t_TimeUnits = await getTranslations("General.timeUnits");

  const trip = await api.trip.viewBySlug(slug);

  if (!trip) notFound();

  const similarTrips = await api.trip.similar(Number(trip.destinationId));
  const adultPrice = trip.adultTripPriceInCents / 100;
  const childPrice = trip.childTripPriceInCents / 100;
  const activeTicketTypes = "ticketTypes" in trip ? trip.ticketTypes : [];
  const displayFromPrice = (trip.displayFromPriceInCents ?? trip.adultTripPriceInCents) / 100;

  const amenities = [
    { title: "transfer", icon: Car },
    { title: "guide", icon: BookCheck },
    { title: "free_cancel", icon: BanknoteX },
    { title: "online_payment", icon: CircleDollarSign },
  ];

  const duration = trip.duration
    .replaceAll("days", t_TimeUnits("days"))
    .replaceAll("hours", t_TimeUnits("hours"))
    .replaceAll("day", t_TimeUnits("day"))
    .replaceAll("hour", t_TimeUnits("hour"));
  // Format size of trip with localized "persons" text
  const sizeOfTrip = trip.sizeOfTrip ? trip.sizeOfTrip.replace("persons", t("persons")) : '';


  // Day name translations
  const dayTranslations: Record<string, { en: string; ru: string; tr: string }> = {
    Sunday: { en: "Sunday", ru: "Вс", tr: "Pazar" },
    Monday: { en: "Monday", ru: "Пн", tr: "Pazartesi" },
    Tuesday: { en: "Tuesday", ru: "Вт", tr: "Salı" },
    Wednesday: { en: "Wednesday", ru: "Ср", tr: "Çarşamba" },
    Thursday: { en: "Thursday", ru: "Чт", tr: "Perşembe" },
    Friday: { en: "Friday", ru: "Пт", tr: "Cuma" },
    Saturday: { en: "Saturday", ru: "Сб", tr: "Cumartesi" },
  };

  const _avarage =
    trip.reviews.reduce((acc, curr) => acc + curr.ratingValue, 0) /
    trip.reviews.length;
  const reviewsValue = isNaN(_avarage) ? 0 : _avarage;
  const reviewsCount = trip.reviews.length;

  const jsonLd: WithContext<TouristTrip> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: localeAttribute(trip, "title"),
    description: localeAttribute(trip, "description"),
    image: mainImage(trip.assetsUrls),
    touristType: "IndividualOrGroup",
    offers: {
      "@type": "Offer",
      price: displayFromPrice.toFixed(2),
      priceCurrency: "USD",
      availability: "InStock",
      url: `${env.NEXT_PUBLIC_APP_URL}/${locale}/trips/${trip.id}`.replaceAll(
        "//",
        "/",
      ),
    },
  };
  const getLocaleDuration = (duration: string) => {
    return duration
      .replaceAll("days", t_TimeUnits("days"))
      .replaceAll("hours", t_TimeUnits("hours"))
      .replaceAll("day", t_TimeUnits("day"))
      .replaceAll("hour", t_TimeUnits("hour"));
  };

  const baseUrl = (env.NEXT_PUBLIC_APP_URL || "https://karimtor.com").replace(/\/$/, "");
  

  const tripSchema = cleanSchema(
    generateTripSchema({
      trip: {
        title: localeAttribute(trip, "title"),
        description: localeAttribute(trip, "description"),
        image: mainImage(trip.assetsUrls),
        slug: trip.slug,
        price: trip.displayFromPriceInCents ?? trip.adultTripPriceInCents,
        reviews: trip.reviews,
      },
      locale,
      baseUrl,
    })
  );
  
  const breadcrumbSchema = cleanSchema(
    generateBreadcrumb([
      { name: "Home", url: `${baseUrl}/${locale}` },
      { name: "Destinations", url: `${baseUrl}/${locale}/destinations` },
      {
        name: localeAttribute(trip.destination, "name"),
        url: `${baseUrl}/${locale}/destinations/${trip.destination.slug}`,
      },
      {
        name: localeAttribute(trip, "title"),
        url: `${baseUrl}/${locale}/trips/${trip.slug}`,
      },
    ])
  );

  return (
    <>
          <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(tripSchema).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <main className="container mx-auto mt-14 space-y-8 px-4 py-8 md:px-6 lg:px-6">
        {/* Image Gallery - Full Width */}
        <div className="space-y-2">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="line-clamp-2 text-xl font-bold md:line-clamp-none md:text-3xl">
                {localeAttribute(trip, "title")}
              </h1>
              <div className="mt-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="line-clamp-2 text-muted-foreground md:line-clamp-none">
                  {localeAttribute(trip.destination.country, "name")},{" "}
                  {localeAttribute(trip.destination, "name")}
                </span>
              </div>
              <div className="mt-4 text-muted-foreground">
                {localeAttribute(trip, "description")}
              </div>
            </div>
            <div>
              <ul className="flex flex-wrap gap-2 empty:hidden">
                {trip.tripTypes.map(({ tripType }) => (
                  <li key={tripType.id}>
                    <Badge>{localeAttribute(tripType, "name")}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <ul className="mb-4 flex items-center justify-end gap-2">
              <li className="group">
                <a
                  href="https://www.instagram.com/kiwitraveleg?igsh=MXJzZjFwY2Fzc2E2Zw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 transition-all duration-200 hover:scale-105 hover:shadow md:h-7"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4 text-pink-600 md:h-5 md:w-5 lg:h-6 lg:w-5" />
                </a>
              </li>
              <li className="group">
                <a
                  href="https://www.facebook.com/share/16NjtcXwqN/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 transition-all duration-200 hover:scale-105 hover:shadow md:h-7 md:w-7 lg:h-8 lg:w-8"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-4 w-4 text-blue-600 md:h-5 md:w-5 lg:h-6 lg:w-5" />
                </a>
              </li>
              <li className="group">
                <a
                  href="https://vk.com/kiwitravelseg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 transition-all duration-200 hover:scale-105 hover:shadow"
                  aria-label="VK"
                >
                  <MessageSquare className="h-4 w-4 text-blue-700 md:h-5 md:w-5 lg:h-6 lg:w-5" />
                </a>
              </li>
              <li className="group">
                <a
                  href="https://t.me/karimkiwi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 transition-all duration-200 hover:scale-105 hover:shadow"
                  aria-label="Telegram"
                >
                  <Send className="h-4 w-4 text-blue-500 md:h-5 md:w-5 lg:h-6 lg:w-5" />
                </a>
              </li>
            </ul>
            <AssetGallery
              assets={trip.assetsUrls}
              title={localeAttribute(trip, "title")}
            />
          </div>
        </div>

        {/* Main Content and Sidebar */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl bg-white p-4 shadow-md lg:shadow-lg">
              <h3 className="text-md mb-6 font-bold text-gray-900">
                {t("tripInformation")}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col items-center rounded-xl bg-blue-50 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-blue-100/60 hover:shadow-md">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    {t("pickupPoint")}
                  </p>
                  <p className="text-base font-semibold text-gray-700">
                    {localeAttribute(trip, "pickupPoint")}
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-xl bg-green-50 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-green-100/60 hover:shadow-md">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    {t("placeOfReturn")}
                  </p>
                  <p className="text-base font-semibold text-gray-700">
                    {localeAttribute(trip, "placeOfReturn")}
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-xl bg-indigo-50 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-100/60 hover:shadow-md">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    <UsersIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    {t("sizeOfTrip")}
                  </p>
                  <p className="text-base font-semibold text-gray-700">
                    {sizeOfTrip || t('notSpecified')}
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-xl bg-amber-50 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-amber-100/60 hover:shadow-md">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <Calendar className="h-6 w-6 text-amber-600" />
                  </div>
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    {t("availableDays")}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {trip.availableDays.map((day, index) => {
                      const translation = dayTranslations[day] || { en: day, ru: day, tr: day };
                      return (
                        <span key={index} className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                          {locale === 'ru' ? translation.ru : locale === 'tr' ? translation.tr : translation.en}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col items-center rounded-xl bg-purple-50 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-purple-100/60 hover:shadow-md">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    {t("duration")}
                  </p>
                  <p className="text-base font-semibold text-gray-700">
                    {duration}
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-xl bg-orange-50 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-orange-100/60 hover:shadow-md">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <Clock className="h-6 w-6 text-[#ff8106]" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("travelTime")}
                  </p>
                  <p className="text-base font-semibold text-gray-600">
                    {format(`0001-01-01T${trip.travelTime}`, "hh:mm a")}
                  </p>
                </div>
              </div>
            </div>

            <div className="block lg:hidden">
              <BookingForm
                availableDays={trip.availableDays}
                tripId={trip.id}
                adultPrice={adultPrice}
                childPrice={!!trip.childAge.trim() ? childPrice : null}
                childAge={trip.childAge}
                infantAge={trip.infantAge}
                displayFromPrice={displayFromPrice}
                ticketTypes={activeTicketTypes}
                duration={duration}
                reviewsValue={reviewsValue}
                reviewsCount={reviewsCount}
              />
            </div>

            <Tabs defaultValue="description" className="w-full justify-start">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">
                  {t("tabs.description")}
                </TabsTrigger>
                <TabsTrigger value="details">{t("tabs.details")}</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6 space-y-4">
                <p className="text-xl font-semibold">{t("tabs.description")}</p>
                <div
                  className="rich-text-editor-cotent prose"
                  dangerouslySetInnerHTML={{
                    __html: localeAttribute(trip, "longDescription"),
                  }}
                />
              </TabsContent>
              <TabsContent value="details" className="mt-6">
                <div className="grid gap-6">
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">
                      {t("tripFeatures")}
                    </h3>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {trip.features.map(({ feature }) => (
                        <li
                          key={feature.id}
                          className="flex items-center gap-2"
                        >
                          <Check className="h-4 w-4 text-primary" />
                          <span>{localeAttribute(feature, "content")}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-3 text-lg font-semibold">
                      {t("amenities")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {amenities.map((amenity) => {
                        const Icon = amenity.icon;
                        return (
                          <div
                            key={amenity.title}
                            className="flex flex-col items-center justify-center rounded-lg bg-muted p-4"
                          >
                            <Icon className="mb-2 h-6 w-6" />
                            <span className="text-center text-sm">
                              {t_Amenities(amenity.title)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="hidden space-y-6 lg:block">
            <BookingForm
              availableDays={trip.availableDays}
              tripId={trip.id}
              adultPrice={adultPrice}
              childPrice={!!trip.childAge.trim() ? childPrice : null}
              childAge={trip.childAge}
              infantAge={trip.infantAge}
              displayFromPrice={displayFromPrice}
              ticketTypes={activeTicketTypes}
              duration={duration}
              reviewsValue={reviewsValue}
              reviewsCount={reviewsCount}
            />

            {/* {trip.reviews.length !== 0 && (
              <>
                <div className="mt-6 flex w-full items-center gap-2 rounded-t-lg bg-muted p-4 pb-0 font-medium">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">{t("reviews")}</h3>
                </div>
                <div className="max-h-[500px] space-y-4 overflow-y-auto rounded-b-lg bg-muted p-4">
                  {trip.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader className="flex-row items-center gap-4">
                        {review.userImageUrl ? (
                          <Image
                            src={review.userImageUrl}
                            alt={review.userEmail}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
                            <User className="size-6" />
                          </div>
                        )}
                        <div>
                          <CardTitle>{review.userFullName}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {review.userEmail}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{review.message}</p>
                        <div className="flex">
                          {Array(5)
                            .fill(null)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.ratingValue
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-muted text-muted"
                                  }`}
                              />
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )} */}
          </div>
        </div>
        <div className="w-full lg:top-8 bg-gray-50 flex flex-col lg:flex-row relative rounded-lg">
          <div className="flex-1 w-full">
            <Testimonials tripId={trip.id} />
          </div>
          <div className="w-full lg:w-80 py-6 px-2 lg:px-0">
            <ReviewWriteForm tripId={trip.id} />
          </div>
        </div>

        {/* Similar Trips */}
        <p className="mt-16 text-2xl font-bold">{t("youMayLike")}</p>
        <div className="!mb-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {similarTrips.map((trip) => (
            <Link
              key={trip.slug}
              href={`/trips/${trip.slug}`}
              className="block overflow-hidden rounded-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-800"
            >
              <Card id={`book-trip-outside-id-${trip.id}`} className="h-full">
                <CardHeader className="relative h-48 w-full p-0">
                  <Image
                    src={mainImage(trip.assetsUrls)}
                    alt={localeAttribute(trip, "title")}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    decoding="async"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
                      ${Math.floor((trip.displayFromPriceInCents ?? trip.adultTripPriceInCents) / 100)}
                    </span>
                    <Button>{t("bookNow")}</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
