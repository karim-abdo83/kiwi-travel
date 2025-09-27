"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Star, User, MessageSquare, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import { localeAttributeFactory } from "@/lib/utils";

export default function Testimonials({ tripId }: { tripId?: number }) {
  const t = useTranslations("HomePage.testimonials");
  const { toast } = useToast();
  const { user } = useUser();
  const isAdmin = !!user?.publicMetadata?.isAdmin;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [localAdminReply, setLocalAdminReply] = useState("");

  const { data, refetch, isLoading: isLoadingReviews } = (tripId ? api.review.listByTripId.useQuery(tripId) : api.review.listTop.useQuery());
  const { mutate: addAdminReply, isPending: isReplyLoading } = api.review.adminReply.useMutation();

  const locale = useLocale();
  const localeAttribute = localeAttributeFactory(locale);


  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="mb-8 text-center text-3xl font-bold">{t("sectionTitle")}</h2>
        <div className="w-full">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 px">
            {isLoadingReviews ?
              <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-24" />
                <Skeleton className="w-full h-24" />
                <Skeleton className="w-full h-24" />
                <Skeleton className="w-full h-24" />
                <Skeleton className="w-full h-24" />
              </div>
              :
              data?.map((review, index) => (
                <Card
                  key={`review-${review.id}`}
                  className="h-full flex flex-col overflow-hidden border border-gray-200 hover:scale-[1.009] transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:border-primary/20 group-hover:scale-[1.02]"
                >
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-3 w-full">
                      {review.userImageUrl ? (
                        <Image
                          src={review.userImageUrl}
                          alt={review.userEmail || 'User'}
                          width={40}
                          height={40}
                          className="rounded-full h-10 w-10 object-cover border-2 border-transparent hover:border-primary transition-all duration-300"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-300">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                      <div className="w-full">
                        <CardTitle className="text-base flex flex-row items-center font-medium justify-between w-full8">
                          <p>
                            {review.userFullName || t("anonymous")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </CardTitle>
                        <div className="text-xs text-gray-500">
                          {review.userEmail}
                        </div>
                        <div className="flex items-center">
                          {Array(5).fill(null).map((_, i) => (
                            <motion.span
                              key={i}
                              whileHover={{ scale: 1.2 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              <Star
                                className={`h-4 w-4 transition-colors duration-200 ${i < review.ratingValue ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 flex flex-col flex-grow">
                    {review?.trip && !tripId &&
                      <Link className="text-blue-500 text-xs mb-4 hover:underline" href={`/trips/${review.trip.slug}`}>
                        {localeAttribute(review.trip, "title")}
                      </Link>
                    }
                    <div className="flex-grow">
                      <p className="text-gray-700 text-sm">{review.message}</p>
                    </div>

                    {review.image && (
                      <div className="mt-3">
                        <img
                          src={review.image}
                          alt="Review"
                          className="max-w-full max-h-48 w-auto h-auto object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity hover:scale-[1.1]  duration-300 ease-in-out"
                          onClick={() => setSelectedImage(review.image!)}
                        />
                      </div>
                    )}

                    {review.adminReply && (
                      <div className="mt-3 rounded-md bg-blue-50 p-3">
                        <div className="mb-1 flex items-center text-sm font-medium text-blue-700">
                          <MessageSquare className="mr-1 h-4 w-4" />
                          {t("adminReply")}
                        </div>
                        <p className="text-sm text-blue-800">{review.adminReply}</p>
                      </div>
                    )}
                  </CardContent>

                  {isAdmin && (
                    <CardFooter className="flex flex-col items-start gap-2 pt-2 border-t">
                      {!review.adminReply && (
                        <>
                          {replyingTo === review.id ? (
                            <div className="flex w-full items-center gap-2">
                              <input
                                type="text"
                                className="flex-1 rounded-md border border-gray-200 p-2 text-sm"
                                placeholder={t('writeReply') || 'Write your reply...'}
                                value={localAdminReply}
                                disabled={isReplyLoading}
                                onChange={(e) => setLocalAdminReply(e.target.value)}
                                onKeyDown={async (e) => {
                                  if (e.key === 'Enter' && localAdminReply.trim()) {
                                    try {
                                      await addAdminReply({
                                        reviewId: review.id,
                                        adminReply: localAdminReply
                                      });
                                      setLocalAdminReply('');
                                      setReplyingTo(null);
                                      await refetch();
                                    } catch (error) {
                                      console.error(error);
                                      toast({
                                        variant: 'destructive',
                                        title: t('error') || 'Error',
                                        description: t('replyFailed') || 'Failed to add reply',
                                      });
                                    }
                                  }
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setReplyingTo(null)}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                disabled={!localAdminReply.trim() || isReplyLoading}
                                className="transition-all duration-200 hover:shadow-md"
                                onClick={async () => {
                                  try {
                                    await addAdminReply({
                                      reviewId: review.id,
                                      adminReply: localAdminReply
                                    });
                                    setLocalAdminReply('');
                                    setReplyingTo(null);
                                    await refetch();
                                  } catch (error) {
                                    console.error(error);
                                    toast({
                                      variant: 'destructive',
                                      title: t('error') || 'Error',
                                      description: t('replyFailed') || 'Failed to add reply',
                                    });
                                  }
                                }}
                              >
                                {isReplyLoading ? t('sending') || 'Sending...' : t('reply') || 'Reply'}
                              </Button>
                            </div>
                          ) : (
                            <motion.button
                              onClick={() => {
                                setReplyingTo(review.id);
                                setLocalAdminReply('');
                              }}
                              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                              whileHover={{ x: 3 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>{t('reply') || 'Reply'}</span>
                            </motion.button>
                          )}
                        </>
                      )}
                    </CardFooter>
                  )}
                </Card>
              ))}

            {(!isLoadingReviews && (!data || data.length === 0)) && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <MessageSquare className="mb-2 h-10 w-10 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700">{t("noReviews")}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t("beFirstToReview")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent
          className="max-w-7xl p-0 bg-transparent border-none shadow-none [&>button]:hidden"
        >
          <DialogTitle className="sr-only">Enlarged Review Image</DialogTitle>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 -top-10 sm:right-0 sm:-top-10 z-10 h-8 w-8 rounded-full bg-gray-600/80 hover:bg-gray-700/90 text-white shadow-md"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>

            {selectedImage && (
              <div className="flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Enlarged review"
                  className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain rounded-lg"
                  style={{
                    maxWidth: 'min(90vw, 1200px)',
                    maxHeight: '80vh'
                  }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </section>
  );
}
