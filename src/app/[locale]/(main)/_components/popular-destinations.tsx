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
    limitFour: true,
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-0">
        <h2 className="mb-8 text-center text-3xl font-bold">
          {t("sectionTitle")}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading &&
            [1, 2, 3, 4].map((item) => (
              <Card key={item} className="overflow-hidden">
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
            <Link key={destination.id} href={`/destinations/${destination.id}`}>
              <Card id={`destination-details-id-${destination.id}`} className="overflow-hidden group">
                <CardHeader className="p-0">
                  <Image
                    src={destination.imageUrl}
                    alt={localeAttribute(destination, "name")}
                    width={300}
                    height={200}
                    className="h-48 w-full object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4 group-hover:bg-muted transition-colors">
                  <CardTitle className="text-center">
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
