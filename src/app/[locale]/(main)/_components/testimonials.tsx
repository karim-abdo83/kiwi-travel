"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, User, MessageSquare, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import { localeAttributeFactory } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

export default function Testimonials({ tripId }: { tripId?: number }) {
  const t = useTranslations("HomePage.testimonials");
  const { toast } = useToast();
  const { user } = useUser();
  const isAdmin = !!user?.publicMetadata?.isAdmin;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [localAdminReply, setLocalAdminReply] = useState("");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const { data, refetch, isLoading: isLoadingReviews } =
    tripId
      ? api.review.listByTripId.useQuery(tripId)
      : api.review.listTop.useQuery();

  const { mutate: addAdminReply, isPending: isReplyLoading } =
    api.review.adminReply.useMutation();

  const locale = useLocale();
  const localeAttribute = localeAttributeFactory(locale);

  return (
    <section className="pt-14 pb-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold sm:text-4xl bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
          {t("sectionTitle")}
        </h2>

        <div className="relative overflow-visible">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: "auto",
            }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-3 sm:-ml-4 py-2">
              {isLoadingReviews ? (
                [1, 2, 3].map((item) => (
                  <CarouselItem
                    key={item}
                    className="pl-3 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="h-[400px] flex flex-col items-center justify-center">
                      <Skeleton className="h-8 w-8 rounded-full mb-3" />
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-2/3" />
                    </Card>
                  </CarouselItem>
                ))
              ) : (
                data?.map((review) => (
                  <CarouselItem
                    key={`review-${review.id}`}
                    className="pl-3 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="flex flex-col border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 bg-white transition-all duration-300 rounded-2xl">
                      <CardHeader className="pb-1 pt-4">
                        <div className="flex items-start gap-4">
                          {review.userImageUrl ? (
                            <Image
                              src={review.userImageUrl}
                              alt={review.userEmail || "User"}
                              width={48}
                              height={48}
                              className="rounded-full h-12 w-12 object-cover border border-gray-200 flex-shrink-0"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                              <User className="h-6 w-6" />
                            </div>
                          )}
                          <div className="flex flex-col flex-grow">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base font-semibold text-gray-800">
                                {review.userFullName || t("anonymous")}
                              </CardTitle>
                              <span className="text-xs text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{review.userEmail}</p>
                            <div className="flex items-center mt-1 space-x-1">
                              {Array(5)
                                .fill(null)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.ratingValue
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-200"
                                      }`}
                                  />
                                ))}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5">
                        {review?.trip && !tripId && (
                          <Link
                            className="text-blue-500 text-xs mb-2 inline-block hover:underline"
                            href={`/trips/${review.trip.slug}`}
                          >
                            {localeAttribute(review.trip, "title")}
                          </Link>
                        )}
                        <p
                          className={`text-gray-700 text-sm leading-relaxed ${!expanded[review.id] ? "line-clamp-5" : ""} ${review.message.length < 60
                              ? "text-center italic text-gray-500"
                              : ""
                            }`}
                        >
                          {review.message}
                        </p>
                        {review.message.length > 180 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 px-0 h-auto text-xs text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              setExpanded((prev) => {
                                const isOpening = !prev[review.id];
                                if (!isOpening) {
                                  return {};
                                }
                                return { [review.id]: true } as Record<number, boolean>;
                              })
                            }
                          >
                            {expanded[review.id]
                              ? t("seeLess") || "See less"
                              : t("seeMore") || "See more"}
                          </Button>
                        )}

                        {review.image && (
                          <div className="mt-4 flex justify-center">
                            <div className="relative w-full h-40 rounded-lg overflow-hidden">
                              <img
                                src={review.image}
                                alt="Review"
                                className="absolute inset-0 w-full h-full object-contain rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                                onClick={() => setSelectedImage(review.image!)}
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>

                      {review.adminReply && (
                        <div className="bg-blue-50 px-5 py-3 border-t border-blue-100">
                          <div className="flex items-center mb-1 text-blue-700 font-medium text-sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {t("adminReply")}
                          </div>
                          <p className="text-sm text-blue-800">
                            {review.adminReply}
                          </p>
                        </div>
                      )}

                      {isAdmin && (
                        <CardFooter className="border-t px-5 py-3">
                          {!review.adminReply && (
                            <>
                              {replyingTo === review.id ? (
                                <div className="flex w-full items-center gap-2">
                                  <input
                                    type="text"
                                    className="flex-1 rounded-md border border-gray-200 p-2 text-sm"
                                    placeholder={
                                      t("writeReply") || "Write reply..."
                                    }
                                    value={localAdminReply}
                                    disabled={isReplyLoading}
                                    onChange={(e) =>
                                      setLocalAdminReply(e.target.value)
                                    }
                                    onKeyDown={async (e) => {
                                      if (
                                        e.key === "Enter" &&
                                        localAdminReply.trim()
                                      ) {
                                        try {
                                          await addAdminReply({
                                            reviewId: review.id,
                                            adminReply: localAdminReply,
                                          });
                                          setLocalAdminReply("");
                                          setReplyingTo(null);
                                          await refetch();
                                        } catch {
                                          toast({
                                            variant: "destructive",
                                            title: t("error") || "Error",
                                            description:
                                              t("replyFailed") ||
                                              "Failed to add reply",
                                          });
                                        }
                                      }
                                    }}
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setReplyingTo(null)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    disabled={
                                      !localAdminReply.trim() || isReplyLoading
                                    }
                                    onClick={async () => {
                                      try {
                                        await addAdminReply({
                                          reviewId: review.id,
                                          adminReply: localAdminReply,
                                        });
                                        setLocalAdminReply("");
                                        setReplyingTo(null);
                                        await refetch();
                                      } catch {
                                        toast({
                                          variant: "destructive",
                                          title: t("error") || "Error",
                                          description:
                                            t("replyFailed") ||
                                            "Failed to add reply",
                                        });
                                      }
                                    }}
                                  >
                                    {isReplyLoading
                                      ? t("sending") || "Sending..."
                                      : t("reply") || "Reply"}
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setReplyingTo(review.id)}
                                  className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                  {t("reply") || "Reply"}
                                </Button>
                              )}
                            </>
                          )}
                        </CardFooter>
                      )}
                    </Card>
                  </CarouselItem>
                ))
              )}
            </CarouselContent>

            {/* FIXED BUTTON POSITION */}
            <div className="absolute top-[42%] sm:top-1/2 -translate-y-1/2 inset-x-0 flex justify-between pointer-events-none">
              <CarouselPrevious className="pointer-events-auto relative left-1 sm:left-2 h-8 w-8 sm:h-9 sm:w-9 bg-white/90 shadow-md hover:bg-white/100 rounded-full z-10" />
              <CarouselNext className="pointer-events-auto relative right-1 sm:right-2 h-8 w-8 sm:h-9 sm:w-9 bg-white/90 shadow-md hover:bg-white/100 rounded-full z-10" />
            </div>
          </Carousel>
        </div>
      </div>

      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
            <DialogTitle className="sr-only">Review Image</DialogTitle>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Full size review"
                width={1200}
                height={800}
                className="w-full h-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
