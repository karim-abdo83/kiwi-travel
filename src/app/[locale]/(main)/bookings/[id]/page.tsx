import { PageParams } from "@/types/page-params";
import { BookingDetails } from "./_components/booking-details";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { localeAttributeFactory } from "@/lib/utils";
import { Metadata } from "next";

export async function generateMetadata({ params }: PageParams<{ id: string }>): Promise<Metadata> {
  const locale = await getLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const { id } = await params;

  const booking = await api.tripBooking.view(Number(id));

  if (!booking) return {};

  return {
    title: `${localeAttribute(booking.trip, "title")} | Karim Tour`,
    robots: {
      index: false,
      follow: false,
    }
  }
}

export default async function BookingDetailsPage({ params }: PageParams<{ id: string }>) {
  const { id } = await params;

  const booking = await api.tripBooking.view(Number(id));

  if (!booking) notFound();

  return (
    <BookingDetails booking={booking} />
  )
}