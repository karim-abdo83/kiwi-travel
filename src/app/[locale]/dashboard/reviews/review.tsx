"use client";

import { ReviewDialog } from "@/components/review-dialog"
import { api } from "@/trpc/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import { useTranslations } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { AlertCircle, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils";
import { DeleteDialog } from "../../(main)/bookings/[id]/_components/delete-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

type Review = {
    id: string;
    ratingValue: number;
    message: string;
    userFullName: string | null;
    userEmail: string;
    userImageUrl: string | null;
    createdAt: Date;
    userId: string;
    trip: {
        id: string;
        title: string;
        slug: string;
    } | null;
    isHiddenByAdmin: boolean;
};
const dialogInitialState = {
    type: null,
    reviewId: null,
};

const Reviews = () => {
    const t = useTranslations("ReviewPage");
    const [dialogState, setDialogState] = useState<{ type: 'add' | 'update' | 'delete' | null, reviewId: number | null }>(dialogInitialState);

    // Get all available trips for the review form
    const {
        data: trips = [],
        isLoading: isLoadingTrips,
        error: tripsError
    } = api.trip.adminList.useQuery();

    // Get top reviews
    const {
        data: reviews = [],
        isLoading: isLoadingReviews,
        error: reviewsError,
        refetch
    } = api.review.listForAdmin.useQuery(undefined, {
        refetchOnWindowFocus: false,
    });

    // Handle errors
    if (tripsError || reviewsError) {
        return (
            <p>{t("error")}</p>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <PageHeader
                    title={t("title")}
                    description={t("description")}
                />
                <Button
                    onClick={() => setDialogState({ type: 'add', reviewId: null })}
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
                            className="p-6 border rounded-lg bg-card hover:shadow-sm transition-shadow relative"
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={review.userImageUrl || undefined}
                                            alt={review.userFullName || review.userEmail}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                        <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                                            {(review.userFullName?.[0] || review.userEmail?.[0] || 'U').toUpperCase()}
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
                                                    className={cn(`h-4 w-4 text-yellow-400`, i < review?.ratingValue && 'fill-yellow-400')}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {review.message && (
                                <p className="mt-4 text-foreground/90">{review.message}</p>
                            )}

                            {!review?.userId && !review?.tripId &&
                                <div className="absolute top-2 right-2 gap-4 flex">
                                    <Button variant="destructive" onClick={() => setDialogState({ type: 'delete', reviewId: review.id })}>Delete</Button>
                                    <Button onClick={() => setDialogState({ type: 'update', reviewId: review.id })}>Edit</Button>
                                </div>
                            }
                        </article>
                    ))}
                </div>
            )}

            {dialogState.type === 'add' &&
                <ReviewDialog
                    isAdmin
                    open
                    onOpenChange={() => setDialogState(dialogInitialState)}
                    title={t("newReview")}
                    bookingId={1}
                    disableManualClose={false}
                    onSuccess={refetch}
                />
            }

            {dialogState.type === 'update' && dialogState.reviewId &&
                <ReviewDialog
                    isAdmin
                    open
                    onOpenChange={() => setDialogState(dialogInitialState)}
                    title={t("editReview")}
                    review={reviews.find((review) => review.id === dialogState.reviewId)}
                    bookingId={1}
                    disableManualClose={false}
                    onSuccess={refetch}
                />
            }

            {dialogState.type === 'delete' && dialogState.reviewId &&
                <DeleteDialog
                    open
                    isAdmin
                    onOpenChange={() => setDialogState(dialogInitialState)}
                    reviewId={dialogState.reviewId}
                    onSuccess={refetch}
                />
            }

        </div>
    );
};

export default Reviews;