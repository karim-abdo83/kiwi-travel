"use client";
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  LinkIcon,
  MapPin,
  Phone,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AssetGallery } from "@/components/asset-gallery";
import { ReviewDialog } from "@/components/review-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { localeAttributeFactory } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { api as serverApi } from "@/trpc/server";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { CancelDialog } from "./cancel-dialog";
import { DeleteDialog } from "./delete-dialog";

type Booking = NonNullable<
  Awaited<ReturnType<typeof serverApi.tripBooking.view>>
>;

export function BookingDetails({ booking }: { booking: Booking }) {
  const t = useTranslations("BookingDetails");

  const { data: d } = api.tripBooking.view.useQuery(booking.id, {
    initialData: booking,
  });
  const data = d!;

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const locale = useLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "accepted":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case "missed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  const canCancel =
    data.status === "pending" ||
    (data.status === "accepted" && !data.trip.isConfirmationRequired);
  const canReview = data.status === "done" && !data.review;

  const travelersCount = data.adultsCount + data.childrenCount + data.infantsCount;

  const adults = data.adultsCount;
  const children = data.childrenCount;
  const infants = data.infantsCount;

  const adultPrice = data.adultPriceInCents / 100;
  const childPrice = data.childPriceInCents / 100;

  const adultTotal = adults * adultPrice;
  const childTotal = children * childPrice;

  return (
    <main className="container mx-auto mt-14 px-4 py-8 lg:px-0">
      <div className="mb-6">
        <Link
          href="/bookings"
          className="mb-4 flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t("backToAllBookings")}
        </Link>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href={`/trips/${data.tripId}`}>
            <Button variant="link" className="p-0">
              <LinkIcon className="!size-6" />
              <h1 className="text-2xl font-bold">
                {localeAttribute(data.trip, "title")}
              </h1>
            </Button>
          </Link>
          <Badge className={`${getStatusColor(data.status)} self-start`}>
            {t(`statuses.${data.status}`).charAt(0).toUpperCase()}
            {t(`statuses.${data.status}`).slice(1)}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AssetGallery
            title={localeAttribute(data.trip, "title")}
            assets={data.trip.assetsUrls}
          />
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t("tripDetails")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t("bookingDate")}</p>
                    <p className="text-muted-foreground">
                      {formatDate(data.bookingDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t("destination")}</p>
                    <p className="text-muted-foreground">
                      {`${localeAttribute(data.trip.destination.country, "name")}, ${localeAttribute(data.trip.destination, "name")}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t("travelers")}</p>
                    <p className="text-muted-foreground">
                      {travelersCount}{" "}
                      {travelersCount === 1 ? t("person") : t("people")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t("contactPhone")}</p>
                    <p className="text-muted-foreground">{data.userPhone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("bookingSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("bookingId")}
                  </span>
                  <span className="font-medium">{data.id}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("status")}</span>
                  <Badge className={getStatusColor(data.status)}>
                    {t(`statuses.${data.status}`).charAt(0).toUpperCase()}
                    {t(`statuses.${data.status}`).slice(1)}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("totalPrice")}
                  </span>
                  <span className="font-bold">
                    $
                    {Math.floor(
                      (data.trip.adultTripPriceInCents * data.adultsCount) / 100,
                    ) + Math.floor(
                      (data.trip.childTripPriceInCents * data.childrenCount) / 100,
                    )}
                  </span>
                </div>
                <Separator />
                <div className="space-y-1 text-sm">
                  {adults > 0 && (
                    <div className="flex items-center justify-between">
                      <span>
                        <span className="w-24 inline-block">{t("adults")}</span>
                        {" "} 
                        {adults} &times; ${adultPrice}
                      </span>
                      <span className="font-medium">${adultTotal.toFixed(2)}</span>
                    </div>
                  )}
                  {children > 0 && (
                    <div className="flex items-center justify-between">
                      <span>
                        <span className="w-24 inline-block">{t("children")}</span>
                        {" "}
                        {children} &times; ${childPrice}
                      </span>
                      <span className="font-medium">${childTotal.toFixed(2)}</span>
                    </div>
                  )}
                  {infants > 0 && (
                    <div className="flex items-center justify-between">
                      <span>
                        <span className="w-24 inline-block">{t("infants")}</span>
                        {" "} 
                        {infants} &times; {t("free")}
                      </span>
                      <span className="font-medium">{t("free")}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-3">
            {data.review ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("review")}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (
                      {format(data.review!.createdAt, "yyyy-MM-dd hh:mm a", {
                        locale: locale === "ru" ? ru : undefined,
                      })}
                      )
                    </span>
                  </CardTitle>
                  <div className="flex">
                    {Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(data.review!.ratingValue)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                  </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {data.review.message}
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    variant="destructive"
                  >
                    <Trash2 />
                    {t("delete")}
                  </Button>
                </CardFooter>
              </Card>
            ) : null}
            {canReview && (
              <Button
                className="w-full"
                onClick={() => setIsReviewDialogOpen(true)}
              >
                {t("leaveAReview")}
              </Button>
            )}
            {canCancel && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setIsCancelDialogOpen(true)}
              >
                {t("cancelBooking")}
              </Button>
            )}
          </div>
        </div>
      </div>
      <ReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        bookingId={data.id}
        title={localeAttribute(data.trip, "title")}
      />
      <CancelDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        bookingId={data.id}
        title={localeAttribute(data.trip, "title")}
      />
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        reviewId={data.review?.id ?? -1}
      />
    </main>
  );
}
