import { CalendarDays, MapPin, Star, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { localeAttributeFactory } from "@/lib/utils";
import { api } from "@/trpc/server";
import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("BookingsPage");

  return {
    title: `${t("title")} | Karim Tour`
  }
}

export default async function BookingsPage() {
  const locale = await getLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const bookings = await api.tripBooking.list();

  const t = await getTranslations("BookingsPage");

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year!, month! - 1, day)));
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

  return (
    <main className="container mx-auto mt-14 px-4 py-8 lg:px-0">
      <h1 className="mb-6 text-3xl font-bold">{t("title")}</h1>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="w-fit mb-4 flex items-center justify-start flex-wrap h-auto gap-y-1">
          <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
          <TabsTrigger value="pending">{t("tabs.pending")}</TabsTrigger>
          <TabsTrigger value="accepted">{t("tabs.accepted")}</TabsTrigger>
          <TabsTrigger value="done">{t("tabs.done")}</TabsTrigger>
          <TabsTrigger value="cancelled">{t("tabs.cancelled")}</TabsTrigger>
          <TabsTrigger value="missed">{t("tabs.missed")}</TabsTrigger>
        </TabsList>

        {["all", "pending", "accepted", "done", "cancelled", "missed"].map(
          (tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookings
                  .filter((booking) => tab === "all" || booking.status === tab)
                  .map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image
                          src={booking.image}
                          alt={localeAttribute(booking, "title")}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                        <Badge
                          className={`absolute right-3 top-3 ${getStatusColor(booking.status)}`}
                        >
                          {t(`tabs.${booking.status}`).charAt(0).toUpperCase() +
                            t(`tabs.${booking.status}`).slice(1)}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-6">
                          <span className="line-clamp-2">
                            {localeAttribute(booking, "title")}
                          </span>
                          <div className="text-xl font-bold">
                            ${booking.price}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {localeAttribute(booking, "location")}
                        </div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(booking.bookingDate)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            {booking.travelersCount}{" "}
                            {booking.travelersCount === 1
                              ? t("traveler")
                              : t("travelers")}
                          </span>
                        </div>
                        {booking.review !== null && (
                          <div className="mt-2 flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i <= (booking.review!.ratingValue || 0)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="w-full"
                        >
                          <Button variant="outline" className="w-full">
                            {t("viewDetails")}
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
              {bookings.filter(
                (booking) => tab === "all" || booking.status === tab,
              ).length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {t("noTripsFound", { status: tab })}
                  </p>
                </div>
              )}
            </TabsContent>
          ),
        )}
      </Tabs>
    </main>
  );
}
