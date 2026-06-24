"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn, localeAttributeFactory } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  tripSearchFormSchema,
  TripSearchFormValues,
} from "@/validators/trip-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, SearchIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { SearchContext } from "./search-provider";

export function Search({
  initialValue,
  initialCountryIds = [],
}: {
  initialValue?: string;
  initialCountryIds?: number[];
}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { setSearchValue, isExtraFiltersOpen, setIsExtraFiltersOpen } =
    use(SearchContext);

  const t = useTranslations("TripsPage");

  const locale = useLocale();
  const localeAttribute = localeAttributeFactory(locale);

  const form = useForm<TripSearchFormValues>({
    resolver: zodResolver(tripSearchFormSchema),
    defaultValues: {
      search: initialValue,
      price: {
        lower: 0,
        greater: 10000,
      },
      destinations: [],
      countries: initialCountryIds,
      types: [],
    },
  });

  const { data: popularDestinations } = api.destination.list.useQuery({
    isPopularOnly: true,
  });
  const { data: countries } = api.country.list.useQuery();
  const { data: tripTypes } = api.tripType.list.useQuery();

  const price = form.watch("price");

  return (
    <div className="mb-8">
      <Card className="mb-6">
        <CardContent className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => setSearchValue(v))}
              className="grid gap-4"
            >
              <Button className="mb-2 h-12 w-full text-lg">
                <SearchIcon className="size-16" />
                {t("searchButton")}
              </Button>

              {/* Search */}
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("destinationLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("destinationPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dateLabel")}</FormLabel>
                    <br />
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 size-4" />
                            {field.value
                              ? format(field.value, "PPP")
                              : t("datePlaceholder")}
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          disabled={(date) => date < new Date()}
                          onSelect={(date) => {
                            field.onChange(date);
                            setIsCalendarOpen(false);
                          }}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              {/* Budget */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("budgetLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="10000"
                        placeholder={t("budgetPlaceholder")}
                        {...field}
                        value={field.value?.greater}
                        onChange={(e) =>
                          field.onChange(
                            Object.assign(field.value ?? {}, {
                              greater: Number(e.target.value),
                            }),
                          )
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                variant="secondary"
                className="mt-2 h-12"
                type="button"
                onClick={() => setIsExtraFiltersOpen(!isExtraFiltersOpen)}
              >
                {isExtraFiltersOpen
                  ? t("filtersToggleHide")
                  : t("filtersToggleShow")}
              </Button>

              {isExtraFiltersOpen && (
                <div className="mt-4 grid gap-6 border-t pt-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("priceRangeLabel")}</FormLabel>
                        <FormControl>
                          <Slider
                            twoThumbs
                            value={[
                              field.value?.lower ?? 0,
                              field.value?.greater ?? 10000,
                            ]}
                            onValueChange={(v) =>
                              field.onChange({
                                lower: v[0],
                                greater: v[1],
                              })
                            }
                            max={10000}
                            step={100}
                          />
                        </FormControl>
                        <div className="px-2">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>${price?.lower}</span>
                            <span>${price?.greater}</span>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Popular Destinations */}
                  <FormField
                    control={form.control}
                    name="destinations"
                    render={() => (
                      <FormItem>
                        <FormLabel className="mb-4">
                          {t("popularDestinationsLabel")}
                        </FormLabel>
                        <div
                          className="grid gap-2"
                          style={{
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(120px, 1fr))",
                          }}
                        >
                          {popularDestinations?.map((destination) => (
                            <FormField
                              key={destination.id}
                              control={form.control}
                              name="destinations"
                              render={({ field }) => (
                                <FormItem className="flex items-end gap-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={
                                        !!field.value?.includes(destination.id)
                                      }
                                      onCheckedChange={(checked) =>
                                        checked
                                          ? field.onChange([
                                              ...(field.value ?? []),
                                              destination.id,
                                            ])
                                          : field.onChange(
                                              (field.value ?? []).filter(
                                                (value) =>
                                                  value !== destination.id,
                                              ),
                                            )
                                      }
                                      value={destination.id}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {localeAttribute(destination, "name")}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Countries */}
                  <FormField
                    control={form.control}
                    name="countries"
                    render={() => (
                      <FormItem>
                        <FormLabel className="mb-4">
                          {t("countriesLabel")}
                        </FormLabel>
                        <div
                          className="grid gap-2"
                          style={{
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(120px, 1fr))",
                          }}
                        >
                          {countries?.map((country) => (
                            <FormField
                              key={country.id}
                              control={form.control}
                              name="countries"
                              render={({ field }) => (
                                <FormItem className="flex items-end gap-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={
                                        !!field.value?.includes(country.id)
                                      }
                                      onCheckedChange={(checked) =>
                                        checked
                                          ? field.onChange([
                                              ...(field.value ?? []),
                                              country.id,
                                            ])
                                          : field.onChange(
                                              (field.value ?? []).filter(
                                                (value) => value !== country.id,
                                              ),
                                            )
                                      }
                                      value={country.id}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {localeAttribute(country, "name")}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Trip Type */}
                  <FormField
                    control={form.control}
                    name="types"
                    render={() => (
                      <FormItem>
                        <FormLabel className="mb-4">
                          {t("tripTypesLabel")}
                        </FormLabel>
                        <div
                          className="grid gap-2"
                          style={{
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(120px, 1fr))",
                          }}
                        >
                          {tripTypes?.map((type) => (
                            <FormField
                              key={type.id}
                              control={form.control}
                              name="types"
                              render={({ field }) => (
                                <FormItem className="flex items-end gap-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={!!field.value?.includes(type.id)}
                                      onCheckedChange={(checked) =>
                                        checked
                                          ? field.onChange([
                                              ...(field.value ?? []),
                                              type.id,
                                            ])
                                          : field.onChange(
                                              (field.value ?? []).filter(
                                                (value) => value !== type.id,
                                              ),
                                            )
                                      }
                                      value={type.id}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {localeAttribute(type, "name")}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
