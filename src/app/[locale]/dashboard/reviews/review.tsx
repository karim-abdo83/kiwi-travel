"use client";

import { ReviewDialog } from "@/components/review-dialog";
import { api } from "@/trpc/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteDialog } from "../../(main)/bookings/[id]/_components/delete-dialog";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@radix-ui/react-avatar";

const dialogInitialState = {
  type: null,
  reviewId: null,
};

const Reviews = () => {
  const t = useTranslations("ReviewPage");
  const [dialogState, setDialogState] = useState<{
    type: "add" | "update" | "delete" | null;
    reviewId: number | null;
  }>(dialogInitialState);

  // Get all available trips for the review form
  const {
    data: trips = [],
    isLoading: isLoadingTrips,
    error: tripsError,
  } = api.trip.adminList.useQuery();

  // Get top reviews
  const {
    data: reviews = [],
    isLoading: isLoadingReviews,
    error: reviewsError,
    refetch,
  } = api.review.listForAdmin.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  // Handle errors
  if (tripsError || reviewsError) {
    return <p>{t("error")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader title={t("title")} description={t("description")} />
        <Button
          onClick={() => setDialogState({ type: "add", reviewId: null })}
          disabled={isLoadingTrips || isLoadingReviews}
          className="w-full sm:w-auto"
        >
          {t("addReview")}
        </Button>
      </div>

      {isLoadingReviews ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : reviews?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noReviews")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow relative"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={review.userImageUrl || undefined}
                      alt={review.userFullName || review.userEmail}
                      className="h-full w-full rounded-full object-cover"
                    />
                    <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {(review.userFullName?.[0] ||
                        review.userEmail?.[0] ||
                        "U"
                      ).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-medium text-foreground">
                      {review.userFullName || review.userEmail}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            `h-4 w-4 text-yellow-400`,
                            i < review?.ratingValue && "fill-yellow-400"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 🗑️ Admin Action Buttons (Always Visible) */}
                <div className="flex gap-2 mt-3 sm:mt-0 sm:ml-auto">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setDialogState({
                        type: "delete",
                        reviewId: Number(review.id),
                      })
                    }
                  >
                    Delete
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setDialogState({
                        type: "update",
                        reviewId: Number(review.id),
                      })
                    }
                  >
                    Edit
                  </Button>
                </div>
              </div>

              {review.message && (
                <p className="mt-4 text-foreground/90">{review.message}</p>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Review Dialogs */}
      {dialogState.type === "add" && (
        <ReviewDialog
          isAdmin
          open
          onOpenChange={() => setDialogState(dialogInitialState)}
          title={t("newReview")}
          bookingId={1}
          disableManualClose={false}
          onSuccess={refetch}
        />
      )}

      {dialogState.type === "update" && dialogState.reviewId && (
        <ReviewDialog
          isAdmin
          open
          onOpenChange={() => setDialogState(dialogInitialState)}
          title={t("editReview")}
          review={reviews?.find(
            (itm: any) => itm.id === dialogState.reviewId
          )}
          bookingId={1}
          disableManualClose={false}
          onSuccess={refetch}
        />
      )}

      {dialogState.type === "delete" && dialogState.reviewId && (
        <DeleteDialog
          open
          isAdmin
          onOpenChange={() => setDialogState(dialogInitialState)}
          reviewId={dialogState.reviewId}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default Reviews;
