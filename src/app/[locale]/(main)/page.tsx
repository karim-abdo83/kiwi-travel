import Hero from "./_components/hero";
import FeaturedTrips from "./_components/featured-trips";
import PopularDestinations from "./_components/popular-destinations";
import WhyChooseUs from "./_components/why-choose-us";
import Testimonials from "./_components/testimonials";
import WeProvide from "./_components/weprovide";

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
