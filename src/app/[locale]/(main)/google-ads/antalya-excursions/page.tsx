import { env } from "@/env";
import { api } from "@/trpc/server";
import type { PageParams } from "@/types/page-params";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CleanExcursionCards } from "../_components/clean-excursion-cards";
import { ANTALYA_TRIPS } from "../_data/western-turkey-excursions";

const pageTitle = "Antalya & Lara Excursions | Karim Tour";
const pageDescription =
  "Book Antalya and Lara excursions, boat trips, rafting and adventures with hotel pickup and clear prices.";

export async function generateMetadata({
  params,
}: PageParams<{ locale: string }>): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") return {};

  const baseUrl = (env.NEXT_PUBLIC_APP_URL || "https://karimtor.com").replace(
    /\/$/,
    "",
  );
  const url = `${baseUrl}/en/google-ads/antalya-excursions`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: url },
    robots: { index: false, follow: true },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "website",
      url,
    },
  };
}

export default async function AntalyaExcursionsAdsPage({
  params,
}: PageParams<{ locale: string }>) {
  const { locale } = await params;
  if (locale !== "en") notFound();

  const destination = await api.trip.listByDestination("antalya-day-tours");
  if (!destination) notFound();

  return (
    <main className="container mx-auto px-4 py-12 md:mt-20 md:py-16 lg:px-6">
      <section className="mx-auto mb-10 max-w-4xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Antalya &amp; Lara Excursions
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
          Book the best excursions from Antalya and Lara with clear prices,
          hotel pickup and easy online booking.
        </p>
      </section>

      <CleanExcursionCards
        destination={destination}
        trips={ANTALYA_TRIPS}
        originLabel="From Antalya / Lara"
        heading="Tours available from Antalya & Lara"
        headingId="antalya-tours-heading"
      />
    </main>
  );
}
