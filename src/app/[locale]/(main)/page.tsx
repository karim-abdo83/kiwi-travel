import Hero from "./_components/hero";
import FeaturedTrips from "./_components/featured-trips";
import PopularDestinations from "./_components/popular-destinations";
import WhyChooseUs from "./_components/why-choose-us";
import Testimonials from "./_components/testimonials";
import WeProvide from "./_components/weprovide";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}`])
      ),
    },
  };
}

export default function Page() {
  return (
    <main className="flex-grow">
      <Hero />
      <WeProvide />
      <PopularDestinations />
      <FeaturedTrips />
      <WhyChooseUs />
      <Testimonials />
    </main>
  );
}
