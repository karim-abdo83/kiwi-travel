import Hero from "./_components/hero";
import FeaturedTrips from "./_components/featured-trips";
import PopularDestinations from "./_components/popular-destinations";
import WhyChooseUs from "./_components/why-choose-us";
import Testimonials from "./_components/testimonials";
import WeProvide from "./_components/weprovide";
import IntroText from "./_components/intro-text";
import AboutUs from "./_components/aboutUs";
import FaqSection from "./_components/faqhome";
import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo/alternates";
import { getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    alternates: buildAlternates("", locale),
  };
}

export default function Page() {
  return (
    <main className="flex-grow">
      <Hero />
      <IntroText/>
      <WeProvide />
      <PopularDestinations />

      <FeaturedTrips />
      <WhyChooseUs />
      <Testimonials />
      <AboutUs />
      <FaqSection />
    </main>
  );
}
