"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { Link } from "@/i18n/routing";
import { localeAttributeFactory } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ChevronsUpDown, Search, Sliders, MapPin, Plane } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Destination = {
  id: number;
  slug: string;
  locationEn: string;
  locationRu: string;
  image: string;
  tripsCount: number;
};

const getLocalizedValue = (locale: string, obj: any, key: string): string => {
  if (!obj) return '';
  
  const enKey = `${key}En`;
  const ruKey = `${key}Ru`;
  
  if (locale === 'ru' && obj[ruKey]) {
    return obj[ruKey] || '';
  }
  
  if (obj[enKey]) {
    return obj[enKey] || '';
  }
  
  return obj[key] || '';
};

export default function SearchCard() {
  const t = useTranslations("HomePage.hero");

  const locale = useLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { data: destinations, isLoading: isLoadingDestinations } =
    api.destination.tinyListSearch.useQuery(debouncedSearchTerm, {
      enabled: open,
    });
    
  const { data: trips, isLoading: isLoadingTrips } =
    api.search.search.useQuery(debouncedSearchTerm || '', {
      enabled: Boolean(debouncedSearchTerm && debouncedSearchTerm.trim().length > 0),
    });

  const isLoading = isLoadingDestinations || isLoadingTrips;
  const hasResults = (destinations?.length ?? 0) > 0 || (trips?.length ?? 0) > 0;

  return (
    <Card className="mx-auto w-full max-w-3xl sm:rounded-xl  ">
      <CardContent className="p-3 lg:p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex sm:flex-row flex-col gap-2 items-center justify-between">
            <h2 className="text-xl font-semibold">{t("cardTitle")}</h2>
            <Link href="/trips">
              <Button variant="secondary" className="flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                {t("advancedFilters")}
              </Button>
            </Link>
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="h-10 w-full justify-between pl-10 font-normal text-muted-foreground hover:bg-background hover:text-muted-foreground"
                >
                  {t("searchPlaceholder")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder={t("search")}
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  className="h-9"
                />
                <CommandList className="max-h-[250px]">
                  {!isLoading && !hasResults && debouncedSearchTerm.length > 0 && (
                    <CommandEmpty>{t("notFound")}</CommandEmpty>
                  )}
                  <CommandGroup heading={t("suggestions")}>
                    {isLoading ? (
                      // Skeleton loading state
                      [1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center gap-3 px-2 py-2">
                          <Skeleton className="sm:block hidden h-8 w-8 rounded-md" />
                          <div className="flex-1 space-y-1">
                            <Skeleton className="h-3 w-3/4 rounded" />
                            <Skeleton className="h-2 w-1/2 rounded" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        {/* Show destinations */}
                        {!debouncedSearchTerm && destinations?.slice(0, 5).map((destination: Destination) => (
                          <CommandItem
                            key={`dest-${destination.id}`}
                            value={`dest-${destination.id}`}
                            onSelect={() => {
                              router.push(`/destinations/${destination.slug}`);
                              setOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                                {destination.image ? (
                                  <img 
                                    src={destination.image} 
                                    alt={`${getLocalizedValue(locale, { nameEn: destination.locationEn, nameRu: destination.locationRu }, 'name')} image`}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">
                                  {getLocalizedValue(locale, { 
                                    nameEn: destination.locationEn, 
                                    nameRu: destination.locationRu 
                                  }, 'name')}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {destination.tripsCount} {t('trips', { count: destination.tripsCount })}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {t('destination')}
                              </span>
                            </div>
                          </CommandItem>
                        ))}

                        {/* Show trips */}
                        {/* Only show trips when there's a search term */}
                        {debouncedSearchTerm && trips?.map((trip) => (
                          <CommandItem
                            key={`trip-${trip.id}`}
                            value={`trip-${trip.id}`}
                            onSelect={() => {
                              router.push(`/trips/${trip.slug}`);
                              setOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                                <Plane className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">
                                  {getLocalizedValue(locale, trip, 'title')}
                                </div>
                                {trip.destination && (
                                  <div className="text-xs text-muted-foreground">
                                    {getLocalizedValue(locale, trip.destination, 'name')}
                                    {trip.country && `, ${getLocalizedValue(locale, trip.country, 'name')}`}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {t('trip')}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
