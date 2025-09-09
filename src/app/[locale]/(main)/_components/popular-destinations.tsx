"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale, useTranslations } from "next-intl";
import { api } from "@/trpc/react";
import { localeAttributeFactory } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function PopularDestinations() {
  const t = useTranslations("HomePage.popularDestinations");

  const locale = useLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const { data: destinations, isLoading } = api.destination.list.useQuery({
    isPopularOnly: true,
    limit: 12,
    minAsLimit: true,
  });


  return (
    <section className="py-16 px-4 lg:px-6">
      <div className="container mx-auto px-4 md:px-0">
        <h2 className="mb-8 text-center text-2xl lg:text-3xl md:text-3xl font-bold">
          {t("sectionTitle")}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {isLoading &&
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
              <Card key={item} className="overflow-hidden h-full">
                <CardHeader className="p-0">
                  <Skeleton className="h-48 rounded-b-none w-full" />
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton
                    className="select-none text-transparent w-fit mx-auto"
                    aria-hidden="true"
                  >
                    Test Big Title
                  </Skeleton>
                </CardContent>
              </Card>
            ))}
          {destinations?.map((destination) => (
            <Link key={destination.id} href={`/destinations/${destination.id}`} className="block h-full">
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={destination.imageUrl}
                    alt={localeAttribute(destination, "name")}
                    width={300}
                    height={200}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <h3 className="text-white text-md font-semibold">
                      {localeAttribute(destination, "name")}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-4 transition-colors duration-300 group-hover:bg-muted/30">
                  <CardTitle className="text-center text-nowrap overflow-hidden text-ellipsis">
                    {localeAttribute(destination, "name")}
                  </CardTitle>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {
          isLoading ? (
            <Skeleton className="mt-8 mx-auto h-10 px-8 text-transparent select-none w-fit" aria-hidden="true">
              {t("showAll")}
            </Skeleton>
          ) : (
            <Link href="/destinations">
              <Button size="lg" className="mt-8 mx-auto block">
                {t("showAll")}
              </Button>
            </Link>
          )
        }
      </div>
    </section>
  );
}