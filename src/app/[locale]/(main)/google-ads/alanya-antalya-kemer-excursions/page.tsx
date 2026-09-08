import { env } from "@/env";
import { api } from "@/trpc/server";
import type { PageParams } from "@/types/page-params";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CleanExcursionCards } from "../_components/clean-excursion-cards";
import {
  ALANYA_TRIPS,
  ANTALYA_TRIPS,
  KEMER_TRIPS,
} from "../_data/western-turkey-excursions";

const pageTitle = "Alanya, Antalya & Kemer Excursions | Karim Tour";
const pageDescription =
  "Book excursions from Alanya, Antalya and Kemer with clear prices, hotel pickup and easy online booking.";

export async function generateMetadata({
  params,
}: PageParams<{ locale: string }>): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") return {};

  const baseUrl = (env.NEXT_PUBLIC_APP_URL || "https://karimtor.com").replace(
    /\/$/,
    "",
  );
  const url = `${baseUrl}/en/google-ads/alanya-antalya-kemer-excursions`;

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

export default async function CombinedExcursionsAdsPage({
  params,
}: PageParams<{ locale: string }>) {
  const { locale } = await params;
  if (locale !== "en") notFound();

  const [alanya, antalya, kemer] = await Promise.all([
    api.trip.listByDestination("alanya-day-tours"),
    api.trip.listByDestination("antalya-day-tours"),
    api.trip.listByDestination("kemer-day-tours"),
  ]);
  if (!alanya || !antalya || !kemer) notFound();

  return (
    <main className="container mx-auto px-4 py-12 md:mt-20 md:py-16 lg:px-6">
      <section className="mx-auto mb-12 max-w-4xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Excursions from Alanya, Antalya &amp; Kemer
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
          Book the best excursions and day tours from Alanya, Antalya and Kemer
          with clear prices, hotel pickup and easy online booking.
        </p>
      </section>

      <div className="space-y-16">
        <CleanExcursionCards
          destination={alanya}
          trips={ALANYA_TRIPS}
          originLabel="From Alanya"
          heading="Alanya Excursions"
          headingId="combined-alanya-heading"
        />
        <CleanExcursionCards
          destination={antalya}
          trips={ANTALYA_TRIPS}
          originLabel="From Antalya / Lara"
          heading="Antalya & Lara Excursions"
          headingId="combined-antalya-heading"
        />
        <CleanExcursionCards
          destination={kemer}
          trips={KEMER_TRIPS}
          originLabel="From Kemer"
          heading="Kemer Excursions"
          headingId="combined-kemer-heading"
        />
      </div>
    </main>
  );
}
