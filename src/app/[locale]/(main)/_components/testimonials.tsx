"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { Star, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Testimonials() {
  const t = useTranslations("HomePage.testimonials");

  const { data } = api.review.listTop.useQuery();

  if (!data) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-0">
          <Skeleton
            className="mb-8 mx-auto select-none text-center text-3xl font-bold text-transparent w-fit"
            aria-hidden="true"
          >
            {t("sectionTitle")}
          </Skeleton>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Card key={item}>
                <CardHeader className="flex-row items-center gap-4">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton
                      className="w-fit select-none text-transparent"
                      aria-hidden="true"
                    >
                      <CardTitle>Test Fullname</CardTitle>
                    </Skeleton>
                    <Skeleton
                      className="w-fit select-none text-sm text-transparent"
                      aria-hidden="true"
                    >
                      test@email.com
                    </Skeleton>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="mt-2 h-5 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (data.length === 0) return <></>

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-0">
        <h2 className="mb-8 text-center text-2xl lg:text-3xl md:text-3xl font-bold">
          {t("sectionTitle")}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 px-6">
          {data.map((review) => (
            <Card key={review.id}>
              <CardHeader className="flex-row items-center gap-4">
                {review.userImageUrl ? (
                  <Image
                    src={review.userImageUrl}
                    alt={review.userEmail}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
                    <User className="size-6" />
                  </div>
                )}
                <div>
                  <CardTitle>{review.userFullName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {review.userEmail}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{review.message}</p>
                <div className="flex">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-current text-yellow-400"
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
