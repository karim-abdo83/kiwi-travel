import { getLocale } from "next-intl/server";
import { Search } from "./_components/search";
import { SearchProvider } from "./_components/search-provider";
import { TripResults } from "./_components/trip-results";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

 const title =
  locale === "en"
    ? "Explore Trips & Tours Worldwide with Local Experts"
    : locale === "ru"
    ? "Туры и экскурсии по всему миру с местными гидами"
    : "Dünya Çapında Turlar ve Geziler – Yerel Rehberlerle";

  const description =
    locale === "en"
      ? "Browse all available trips and tours by destination, duration and price. Book unforgettable experiences with Karim Tour."
      : locale === "ru"
      ? "Выберите туры и экскурсии по направлениям, длительности и цене. Онлайн-бронирование с Karim Tour."
      : "Destinasyona, süreye ve fiyata göre tüm turları keşfedin. Karim Tour ile kolay rezervasyon.";

  return {
    title,
    description,
  };
}



export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const awaitedSearchParams = await searchParams;

  const initialSearchValue =
    typeof awaitedSearchParams.search === "string"
      ? awaitedSearchParams.search
      : awaitedSearchParams.search instanceof Array
        ? awaitedSearchParams.search[0]
        : undefined;

  return (
    <main className="container flex flex-col-reverse lg:grid grid-cols-3 gap-4 mx-auto mt-14 px-4 py-8 lg:px-0">
      <SearchProvider>
        <TripResults />
        <Search initialValue={initialSearchValue} />
      </SearchProvider>
    </main>
  );
}
