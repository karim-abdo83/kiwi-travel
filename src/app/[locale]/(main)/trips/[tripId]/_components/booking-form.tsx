"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import {
  tripBookingFormSchema,
  TripBookingFormValues,
} from "@/validators/trip-booking-schema";
import { days } from "@/validators/trip-schema";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Lock, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface BookingFormProps {
  duration: string;
  availableDays: (typeof days)[number][];
  tripId: number;
  reviewsCount: number;
  reviewsValue: number;
  adultPrice: number;
  childAge: string;
  infantAge: string;
  childPrice: number | null;
}

const BookingForm = ({
  duration,
  availableDays,
  tripId,
  reviewsCount,
  reviewsValue,
  adultPrice,
  childPrice,
  childAge,
  infantAge,
}: BookingFormProps) => {
  const t = useTranslations("TripDetailsPage.bookingForm");

  const { isSignedIn, isLoaded } = useAuth();

  // array of day indexes of the current trip's `availableDays`
  // e.g.
  // ["Monday", "Friday"] ======> [1, 5]
  // ["Tuesday"] ======> [2]
  const mappedDays = availableDays.map((item) => days.indexOf(item));

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">${adultPrice}</span>
              <span className="text-muted-foreground">{t("perPerson")}</span>
            </div>

            {/* Child Price - only show if not null */}
            {childPrice !== null && (
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold">${childPrice}</span>
                <span className="text-sm text-muted-foreground">
                  {t("perChild")}{" "}
                  ({childAge})
                </span>
              </div>
            )}

            {/* Infant Price - only show if not null */}
            {!!infantAge.trim() && (
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold">{t("free")}</span>
                <span className="text-sm text-muted-foreground">
                  {t("perInfant")} ({infantAge})
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{duration}</span>
          </div>
          {reviewsValue !== 0 && reviewsCount !== 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(reviewsValue) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
                    />
                  ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {reviewsValue} ({reviewsCount} {t("reviews")})
              </span>
            </div>
          ) : null}
        </div>

        {isSignedIn ? (
          <BookingSubmitDialog
            mappedDays={mappedDays}
            adultPrice={adultPrice}
            childPrice={childPrice}
            childAge={childAge}
            infantAge={infantAge}
            tripId={tripId}
          />
        ) : (
          <SignInButton>
            <Button variant="outline" disabled={!isLoaded} className="w-full">
              {isLoaded ? (
                <>
                  <Lock />
                  {t("signInFirstly")}
                </>
              ) : (
                t("loading")
              )}
            </Button>
          </SignInButton>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>{t("noCharge")}</p>
        </div>
      </CardContent>
    </Card>
  );
};

interface BookingSubmitDialog {
  mappedDays: number[];
  tripId: number;
  adultPrice: number;
  childAge: string;
  infantAge: string;
  childPrice: number | null;
}

const BookingSubmitDialog = ({
  mappedDays,
  tripId,
  adultPrice,
  childPrice,
  childAge,
  infantAge,
}: BookingSubmitDialog) => {
  const t = useTranslations("TripDetailsPage.bookingForm");

  const [open, setOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { toast } = useToast();

  const { mutate: createBooking, isPending } =
    api.tripBooking.create.useMutation({
      onSuccess: ({ message }) => {
        toast({
          title: "Success",
          description: message,
        });

        setOpen(false);
      },
      onError: ({ message }) => {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      },
    });

  // Initialize the form
  const form = useForm<TripBookingFormValues>({
    resolver: zodResolver(tripBookingFormSchema),
    defaultValues: {
      adultsCount: 1,
      childrenCount: 0,
      infantsCount: 0,
      phone: "",
    },
  });

  // Get the current traveler counts for price calculation
  const adults = form.watch("adultsCount") || 1
  const children = form.watch("childrenCount") || 0
  const infants = form.watch("infantsCount") || 0

  // Calculate total price based on traveler types
  const adultTotal = adultPrice * adults
  const childTotal = (childPrice ?? 0) * children
  const totalPrice = (adultTotal + childTotal).toFixed(2)

  const handleIncreaseCount = (field: "adultsCount" | "childrenCount" | "infantsCount") => {
    const current = form.getValues(field) || 0
    const max = 10
    if (current < max) {
      form.setValue(field, current + 1, { shouldValidate: true })
    }
  }

  const handleDecreaseCount = (field: "adultsCount" | "childrenCount" | "infantsCount") => {
    const current = form.getValues(field) || 0
    const min = field === "adultsCount" ? 1 : 0
    if (current > min) {
      form.setValue(field, current - 1, { shouldValidate: true })
    }
  }

  function onSubmit(data: TripBookingFormValues) {
    if (isPending) return;

    createBooking({
      ...data,
      tripId,
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (isPending) return;

        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" id={`book-trip-open-dialog-id-${tripId}`} className="w-full">
          {t("bookNow")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id={`book-trip-form-id-${tripId}`} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("bookingDate")}</FormLabel>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : t("selectDate")}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        disabled={(d) =>
                          d < new Date() || !mappedDays.includes(d.getDay())
                        }
                        onSelect={(d) => {
                          if (!d) return;

                          form.setValue("date", d);
                          setIsCalendarOpen(false);
                        }}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label className="block mb-2 text-sm font-medium">{t("travelersCount")}</Label>
              <Card className="p-3 space-y-3">
                <FormField
                  control={form.control}
                  name="adultsCount"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{t("adults")}</p>
                        </div>
                        <div className="flex items-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleDecreaseCount("adultsCount")}
                            disabled={field.value <= 1}
                          >
                            -
                          </Button>
                          <FormControl>
                            <div className="w-8 text-center">
                              <span className="text-sm font-medium">{field.value}</span>
                              <Input
                                type="hidden"
                                {...field}
                                onChange={(e) => {
                                  const value = Number.parseInt(e.target.value)
                                  field.onChange(isNaN(value) ? 1 : value)
                                }}
                              />
                            </div>
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleIncreaseCount("adultsCount")}
                            disabled={field.value >= 10}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                {
                  childPrice !== null && (
                    <FormField
                      control={form.control}
                      name="childrenCount"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{t("children")}</p>
                              <p className="text-xs text-muted-foreground">
                                {childAge}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleDecreaseCount("childrenCount")}
                                disabled={field.value <= 0}
                              >
                                -
                              </Button>
                              <FormControl>
                                <div className="w-8 text-center">
                                  <span className="text-sm font-medium">{field.value}</span>
                                  <Input
                                    type="hidden"
                                    {...field}
                                    onChange={(e) => {
                                      const value = Number.parseInt(e.target.value)
                                      field.onChange(isNaN(value) ? 0 : value)
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleIncreaseCount("childrenCount")}
                                disabled={field.value >= 10}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  )
                }

                {
                  !!infantAge.trim() && (
                    <FormField
                      control={form.control}
                      name="infantsCount"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{t("infants")}</p>
                              <p className="text-xs text-muted-foreground">{infantAge}</p>
                            </div>
                            <div className="flex items-center">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleDecreaseCount("infantsCount")}
                                disabled={field.value <= 0}
                              >
                                -
                              </Button>
                              <FormControl>
                                <div className="w-8 text-center">
                                  <span className="text-sm font-medium">{field.value}</span>
                                  <Input
                                    type="hidden"
                                    {...field}
                                    onChange={(e) => {
                                      const value = Number.parseInt(e.target.value)
                                      field.onChange(isNaN(value) ? 0 : value)
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleIncreaseCount("infantsCount")}
                                disabled={field.value >= 10}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  )
                }

              </Card>
            </div>

            <Card className="p-3 space-y-2">
              <div className="space-y-1 text-sm">
                {adults > 0 && (
                  <div className="flex items-center justify-between">
                    <span>
                      {t("adults")} ({adults}) &times; ${adultPrice}
                    </span>
                    <span>${adultTotal.toFixed(2)}</span>
                  </div>
                )}
                {children > 0 && (
                  <div className="flex items-center justify-between">
                    <span>
                      {t("children")} ({children}) &times; ${childPrice}
                    </span>
                    <span>${childTotal.toFixed(2)}</span>
                  </div>
                )}
                {infants > 0 && (
                  <div className="flex items-center justify-between">
                    <span>
                      {t("infants")} ({infants}) &times; {t("free")}
                    </span>
                    <span>{t("free")}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-bold">{t("total")}</span>
                <span className="font-bold">${totalPrice}</span>
              </div>
            </Card>

            <DialogFooter>
              <Button id={`book-trip-inside-dialog-id-${tripId}`} disabled={isPending} type="submit" className="w-full">
                {t("completeBooking")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
