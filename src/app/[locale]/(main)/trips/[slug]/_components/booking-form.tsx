"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Link } from "@/i18n/routing";
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
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { BookLock, CalendarIcon, FileText, Loader2, MessageCircleQuestion, ShieldCheck, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocale } from "next-intl";
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
  const locale = useLocale();
  const { isSignedIn, isLoaded } = useAuth();
  const mappedDays = availableDays.map((item) => days.indexOf(item));

// const {mutate: testMutate} = api.tripBooking.testEmail.useMutation({
//   onSuccess: () => {
//     console.log('===>>> Sent');
//   },
//   onError: (err) => {
//     console.log('==>> Failed', err?.message);
//   },
// });
  return (
    <Card className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <CardContent className="space-y-0 p-0">
        {/* <Button onClick={() => testMutate()}>Test Email</Button> */}
        {/* Price Header Section */}
        <div className="px-6 pt-6 pb-4">
          <div className="text-lg text-gray-500 mb-1">{t("priceFrom")}</div>
          <div className="space-y-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-md font-semibold text-gray-500">{t("perPerson")}</span>
                <span className="text-lg font-semibold text-primary">
                        {locale === 'en' ? '€' : '$'}{adultPrice}
                      </span>
              </div>
              {/* Child Price - only show if not null */}
              {childPrice !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-md font-semibold text-gray-500">
                    {t("perChild")}{" "}
                    ({childAge})
                  </span>
                  <span className="text-lg font-semibold text-primary">
                        {locale === 'en' ? '€' : '$'}{childPrice}
                      </span>
                </div>
              )}

              {/* Infant Price - only show if not null */}
              {!!infantAge.trim() && (
                <div className="flex items-center justify-between">
                  <span className="text-md font-semibold text-green-600">{t("free")}</span>
                  <span className="text-md font-semibold text-gray-500">
                    {t("perInfant")} ({infantAge})
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              <span className="text-md text-gray-500">{duration}</span>
            </div>

            {reviewsValue !== 0 && reviewsCount !== 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(reviewsValue) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                </div>
                <span className="text-sm text-gray-500">
                  {reviewsValue} ({reviewsCount} {t("reviews")})
                </span>
              </div>
            ) : null}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="px-6 space-y-3">
          <BookingSubmitDialog
            mappedDays={mappedDays}
            adultPrice={adultPrice}
            childPrice={childPrice}
            childAge={childAge}
            infantAge={infantAge}
            tripId={tripId}
            isSignedIn={isSignedIn}
            locale={locale}
          />
          {/* ) : (
        <SignInButton>
          <Button 
            variant="outline" 
            disabled={!isLoaded} 
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-full border-0 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isLoaded ? (
              <>
                <Lock className="mr-2 h-4 w-4" />
                {t("signInFirstly")}
              </>
            ) : (
              t("loading")
            )}
          </Button>
        </SignInButton>
      )} */}

          {/* WhatsApp Contact Button */}
          <Link href="https://wa.me/79645056936" target="_blank" className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-4 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
           {t("contactViaWhatsApp")}
          </Link>
        </div>
        {/* Features Section */}
        <div className="px-6 py-2 space-y-2 border-t border-gray-50 ">
          {/* Safe Payment */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <ShieldCheck className="w text-gray-500" />
            </div>
            <h3 className="font-semibold text-gray-900 ">{t("safePayment")}</h3>
            <p className="text-sm text-gray-500">{t("safePaymentDescription")}</p>
          </div>
          <hr />

          {/* No Hidden Fees */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <BookLock className=" text-gray-500" />
            </div>
            <h3 className="font-semibold text-gray-900 ">{t("noHiddenFees")}</h3>
            <p className="text-sm text-gray-500">{t("noHiddenFeesDescription")}</p>
          </div>
          <hr />

          {/* Official Partner */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <FileText className=" text-gray-500" />
            </div>
            <h3 className="font-semibold text-gray-900 ">{t("officialPartner")}</h3>
            <p className="text-sm text-gray-500">{t("officialPartnerDescription")}</p>
          </div>
          <hr />

          {/* Trusted Help Center */}
          <div className="flex flex-col items-center text-center pb-4">
            <div className="w-16 h-16 flex items-center justify-center">
              <MessageCircleQuestion className=" text-gray-500" />
            </div>
            <h3 className="font-semibold text-gray-900 ">{t("trustedHelpCenter")}</h3>
            <p className="text-sm text-gray-500">{t("trustedHelpCenterDescription")}</p>
          </div>
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
  isSignedIn: boolean | undefined;
  locale: string;
}

const BookingSubmitDialog = ({
  mappedDays,
  tripId,
  adultPrice,
  childPrice,
  childAge,
  infantAge,
  isSignedIn,
  locale,
}: BookingSubmitDialog) => {
  const t = useTranslations("TripDetailsPage.bookingForm");

  const [open, setOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { toast } = useToast();

  const createBookingMutation = isSignedIn ? api.tripBooking.create.useMutation : api.tripBooking.createAnonymously.useMutation;
  
  const { mutate: createBooking, isPending } = createBookingMutation({      onSuccess: ({ message }) => {
        toast({
          title: t("success"),
          description: message,
          variant: "default",
        });

        // Reset form and close dialog
        form.reset({
          name: "",
          adultsCount: 1,   
          childrenCount: 0,
          infantsCount: 0,
          phone: "",
          email: "",
          date: undefined,
        });
        setOpen(false);
      },
      onError: ({ message }) => {
          toast({
            title: t("error"),
            description: message,
            variant: "destructive",
          });
      },
    });

  // Initialize the form
  const form = useForm<TripBookingFormValues>({
    resolver: zodResolver(tripBookingFormSchema),
    defaultValues: {
      name: "",
      adultsCount: 1,
      childrenCount: 0,
      infantsCount: 0,
      phone: "",
      email: "",
      hotelNameAddress: "",
      roomNumberOrSpecialRequests: "",
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

    if (!isSignedIn && !data.email) {
      form.setError("email", { 
        type: 'required', 
        message: 'Email is required for guest bookings'
      });
      return;
    }

    createBooking({
      ...data,
      tripId,
      email: data.email || "",
    });
  }

  console.log("isPending", form?.formState?.errors);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (isPending) return;

        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" id={`book-trip-open-dialog-id-${tripId}`} className="w-full rounded-full py-6">
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
              render={({ field, fieldState }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("bookingDate")}</FormLabel>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={fieldState.invalid ? "destructive" : "outline"}
                          className={`w-full justify-start text-left font-normal ${fieldState.invalid ? 'border-red-500' : ''}`}
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
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+1 (555) 123-4567" 
                      {...field} 
                      className={fieldState.invalid ? 'border-red-500' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      className={fieldState.invalid ? 'border-red-500' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isSignedIn && <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required for guest bookings",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address"
                }
              }}
              render={({ field , fieldState}) => (
                <FormItem>
                  <FormLabel>{t("bookingEmail")}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field}
                    className={fieldState.invalid ? 'border-red-500' : ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />}

            <div>
              <FormField
  control={form.control}
  name="hotelNameAddress"
  render={({ field }) => (
    <FormItem>
      <FormLabel>{locale === "ru" ? "Название отеля / Адрес" : "Hotel name / Address"}</FormLabel>
      <FormControl>
        <Input placeholder={locale === "ru" ? "Название отеля или адрес" : "Hotel name or address"} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="roomNumberOrSpecialRequests"
  render={({ field }) => (
    <FormItem>
      <FormLabel>{locale === "ru" ? "Номер комнаты / Особые пожелания" : "Room number / Special requests"}</FormLabel>
      <FormControl>
        <Input placeholder={locale === "ru" ? "Номер комнаты или особые пожелания" : "Room number or special requests"} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
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
                      {t("adults")} ({adults}) &times; {locale === 'en' ? '€' : '$'}{adultPrice}
                    </span>
                    <span>{locale === 'en' ? '€' : '$'}{adultTotal.toFixed(2)}</span>
                  </div>
                )}
                {children > 0 && (
                  <div className="flex items-center justify-between">
                    <span>
                      {t("children")} ({children}) &times; {locale === 'en' ? '€' : '$'}{childPrice}
                    </span>
                    <span>{locale === 'en' ? '€' : '$'}{childTotal.toFixed(2)}</span>
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
                <span className="font-bold">{locale === 'en' ? '€' : '$'}{totalPrice}</span>
              </div>
            </Card>

            <DialogFooter>
              <Button id={`book-trip-inside-dialog-id-${tripId}`} disabled={isPending} type="submit" className="w-full">
                {t("completeBooking")}
                {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </DialogFooter>
            <p className="text-center text-sm text-muted-foreground">
              {t("noCharge")}
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
