"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { PLACEHOLDER_IMAGE, TRIP_SEARCH_PAGE_SIZE } from "@/constants";
import { Link } from "@/i18n/routing";
import { localeAttributeFactory } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { use, useState } from "react";
import { SearchContext } from "./search-provider";

export function TripResults() {
  const t = useTranslations("TripsPage");
  const t_TimeUnits = useTranslations("General.timeUnits");

  const { searchValue, isExtraFiltersOpen } = use(SearchContext);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, isLoading } = api.trip.listSearch.useQuery(
    Object.assign(searchValue, {
      page: pageIndex,
    }),
  );

  const locale = useLocale();
  const localeAttribute = localeAttributeFactory(locale);

  if (!data || isLoading) {
    return (
      <div className="col-span-2">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton
            aria-hidden="true"
            className="select-none text-xl font-bold text-transparent"
          >
            {t("tripsFoundHeader", { count: 0 })}
          </Skeleton>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {(isExtraFiltersOpen ? [1, 2, 3, 4, 5, 6] : [1, 2]).map((item) => (
            <Card key={item} className="overflow-hidden">
              <Skeleton className="h-48 w-full rounded-b-none" />
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-60" />
                    <Skeleton className="h-5 w-60" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="ms-auto h-7 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <Skeleton className="mt-4 h-5 w-full" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton
                  aria-hidden="true"
                  className="h-9 select-none text-transparent"
                >
                  {t("viewDetailsButton")}
                </Skeleton>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const pages = generatePages({
    pageIndex,
    totalCount: data.totalCount,
  });

  const getDuration = (duration: string) => {
    return duration
      .replaceAll("days", t_TimeUnits("days"))
      .replaceAll("hours", t_TimeUnits("hours"))
      .replaceAll("day", t_TimeUnits("day"))
      .replaceAll("hour", t_TimeUnits("hour"));
  };

  return (
    <div className="col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {t("tripsFoundHeader", { count: data.totalCount })}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.items.map((trip) => (
          <Link href={`/trips/${trip.slug}`}>
            <Card
              key={trip.id}
              id={`book-trip-outside-id-${trip.id}`}
              className="relative overflow-hidden"
            >
              {trip.isFeatured && (
                <div className="absolute -left-10 top-10 z-10 w-48 -rotate-45 bg-red-500 py-[1px] text-center text-primary-foreground">
                  {t("featured")}
                </div>
              )}
              <div className="relative h-48">
                <Image
                  src={trip.image || PLACEHOLDER_IMAGE}
                  alt={localeAttribute(trip, "title")}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">
                      {localeAttribute(trip, "title")}
                    </h3>
                    <Link
                      href={`/destinations/${trip.destinationSlug}`}
                      className="mt-1 flex items-center text-sm text-muted-foreground hover:text-primary"
                    >
                      <MapPin className="mr-1 h-4 w-4" />
                      {localeAttribute(trip, "location")}
                    </Link>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${trip.price}</div>
                    <div className="text-xs text-muted-foreground">
                      {t("tripCardPricePerPerson")}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {getDuration(trip.duration)}
                  </div>
                  {trip.reviewsCount !== 0 && (
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 text-yellow-500" />
                      {trip.reviewsValue} ({trip.reviewsCount})
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">{t("viewDetailsButton")}</Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {data.totalCount > TRIP_SEARCH_PAGE_SIZE && (
        <TripResultsPagination
          pages={pages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          totalCount={data.totalCount}
        />
      )}
    </div>
  );
}

const getTotalPages = (totalCount: number) =>
  Math.ceil(totalCount / TRIP_SEARCH_PAGE_SIZE);

const generatePages = ({
  pageIndex,
  totalCount,
}: {
  pageIndex: number;
  totalCount: number;
}) => {
  const totalPages = getTotalPages(totalCount);

  const pages = [];
  const maxVisiblePages = 5; // Maximum visible page numbers

  if (totalPages <= maxVisiblePages) {
    // If total pages are less than or equal to maxVisiblePages, show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Otherwise, calculate visible pages with ellipsis
    const leftSiblingIndex = Math.max(pageIndex + 1 - 1, 1); // Current page - 1
    const rightSiblingIndex = Math.min(pageIndex + 1 + 1, totalPages); // Current page + 1

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      // Case: 1 2 3 4 ... 10
      for (let i = 1; i <= maxVisiblePages - 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      // Case: 1 ... 7 8 9 10
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      // Case: 1 ... 4 5 6 ... 10
      pages.push(1);
      pages.push("...");
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages.map(String);
};

const TripResultsPagination = ({
  pages,
  pageIndex,
  setPageIndex,
  totalCount,
}: {
  pages: string[];
  pageIndex: number;
  setPageIndex: (value: number) => void;
  totalCount: number;
}) => {
  const t = useTranslations("TripsPage");

  const totalPages = getTotalPages(totalCount);

  return (
    <Pagination>
      <PaginationContent className="mt-8">
        {/* Previous Button */}
        <PaginationItem>
          <Button
            variant="ghost"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            <ChevronLeft className="size-4" />
            {t("previous")}
          </Button>
        </PaginationItem>

        {/* Page Numbers */}
        {pages.map((page, index) =>
          page === "..." ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <span>...</span>
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <Button
                onClick={() => setPageIndex(Number(page) - 1)}
                variant={pageIndex + 1 === Number(page) ? "outline" : "ghost"}
              >
                {page}
              </Button>
            </PaginationItem>
          ),
        )}

        {/* Next Button */}
        <PaginationItem>
          <Button
            variant="ghost"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={pageIndex + 1 === totalPages}
          >
            {t("next")}
            <ChevronRight className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
