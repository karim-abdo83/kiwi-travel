import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Globe,
  MapPin,
  MessageCircle,
  Star,
  User,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import BookingForm from "./_components/booking-form";
import { AssetGallery } from "@/components/asset-gallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageParams<{ tripId: string }>): Promise<Metadata> {
  const { tripId } = await params;

  const locale = await getLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const trip = await api.trip.view(Number(tripId));

  if (!trip) return {};

  const title = `${localeAttribute(trip, "title")} | Karim Tour`;

  return {
    title,
    openGraph: {
      title,
      images: [
        {
          url: mainImage(trip.assetsUrls),
          alt: localeAttribute(trip, "title"),
        },
      ],
    },
  };
}

export default async function TripDetailsPage({
  params,
}: PageParams<{ tripId: string }>) {
  const { tripId } = await params;

  const locale = await getLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const t = await getTranslations("TripDetailsPage");

  const t_Amenities = await getTranslations("General.amenities");
  const t_TimeUnits = await getTranslations("General.timeUnits");

  const trip = await api.trip.view(Number(tripId));

  if (!trip) notFound();

  const adultPrice = trip.adultTripPriceInCents / 100;
  const childPrice = trip.childTripPriceInCents / 100;

  const amenities = [
    {
      title: "transfer",
      icon: Car,
    },
    {
      title: "guide",
      icon: BookCheck,
    },
    {
      title: "free_cancel",
      icon: BanknoteX,
    },
    {
      title: "online_payment",
      icon: CircleDollarSign,
    },
  ];

  const duration = trip.duration
    .replaceAll("days", t_TimeUnits("days"))
    .replaceAll("hours", t_TimeUnits("hours"))
    .replaceAll("day", t_TimeUnits("day"))
    .replaceAll("hour", t_TimeUnits("hour"));

  const _avarage =
    trip.reviews.reduce((acc, curr) => acc + curr.ratingValue, 0) /
    trip.reviews.length;
  const reviewsValue = isNaN(_avarage) ? 0 : _avarage;
  const reviewsCount = trip.reviews.length;

  return (
    <main className="container mx-auto mt-14 px-4 py-8 md:px-0">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content - 2/3 width on desktop */}
        <div className="space-y-8 lg:col-span-2">
          {/* Trip Title and Status */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold">
                {localeAttribute(trip, "title")}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {localeAttribute(trip.destination.country, "name")},{" "}
                  {localeAttribute(trip.destination, "name")}
                </span>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2 empty:hidden">
              {
                trip.tripTypes.map(({ tripType }) => <li key={tripType.id}>
                  <Badge>
                    {localeAttribute(tripType, "name")}
                  </Badge>
                </li>)
              }
            </ul>
          </div>
          <p className="text-muted-foreground">
            {localeAttribute(trip, "description")}
          </p>

          {/* Main Image Gallery */}
          <AssetGallery
            assets={trip.assetsUrls}
            title={localeAttribute(trip, "title")}
          />

          {/* Tabs for Description and Details */}
          <Tabs defaultValue="description" className="w-full lg:block hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">
                {t("tabs.description")}
              </TabsTrigger>
              <TabsTrigger value="details">{t("tabs.details")}</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6 space-y-4">
              <div
                className="prose rich-text-editor-cotent"
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
                      <li key={feature.id} className="flex items-center gap-2">
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

        {/* Sidebar - 1/3 width on desktop */}
        <div className="lg:col-span-1">
          <BookingForm
            availableDays={trip.availableDays}
            tripId={trip.id}
            adultPrice={adultPrice}
            childPrice={!!trip.childAge.trim() ? childPrice : null}
            childAge={trip.childAge}
            infantAge={trip.infantAge}
            duration={duration}
            reviewsValue={reviewsValue}
            reviewsCount={reviewsCount}
          />

          {/* Tabs for Description and Details for mobile */}
          <Tabs defaultValue="description" className="lg:hidden mt-6 w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">
                {t("tabs.description")}
              </TabsTrigger>
              <TabsTrigger value="details">{t("tabs.details")}</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6 space-y-4">
              <div
                className="prose rich-text-editor-cotent"
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
                      <li key={feature.id} className="flex items-center gap-2">
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

          <div className="mt-6 rounded-lg bg-muted p-4">
            <div className="mb-2 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="font-medium">{t("tripInformation")}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("country")}</span>
                <span className="font-medium">
                  {localeAttribute(trip.destination.country, "name")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("destination")}
                </span>
                <span className="font-medium">
                  {localeAttribute(trip.destination, "name")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("duration")}</span>
                <span className="font-medium">{duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("type")}</span>
                <span className="font-medium">{trip.tripTypes.map(t => localeAttribute(t.tripType, "name")).join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("travelTime")}</span>
                <span className="font-medium">
                  {format(`0001-01-01T${trip.travelTime}`, "hh:mm a")}
                </span>
              </div>
            </div>
          </div>

          {trip.reviews.length !== 0 && (
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
                              className={`h-4 w-4 ${
                                i < review.ratingValue
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
          )}
        </div>
      </div>
    </main>
  );
}
