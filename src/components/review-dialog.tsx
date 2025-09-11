"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCommonMutationResponse } from "@/hooks/use-common-mutation-response";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: number;
  title: string;
  disableManualClose?: boolean;
  // For admin
  isAdmin?: boolean;
  onSuccess?: () => void;
  review?: {
    message: string;
    id: number;
    createdAt: Date;
    tripId: number | null;
    userId: string | null;
    userEmail: string;
    tripBookingId: number | null;
    userImageUrl: string | null;
    userFullName: string | null;
    ratingValue: number;
    isHiddenByAdmin: boolean;
  };
}

export function ReviewDialog({
  open,
  onOpenChange,
  bookingId,
  title,
  disableManualClose,
  // 
  isAdmin = false,
  onSuccess,
  review: reviewToEdit = undefined,
}: ReviewDialogProps) {
  const t = useTranslations("ReviewDialog");
  const t_ToastMessage = useTranslations("ToastMessages");

  const [rating, setRating] = useState(reviewToEdit ? reviewToEdit?.ratingValue || 0 : 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState(reviewToEdit ? reviewToEdit?.message || "" : "");
  const [email, setEmail] = useState(reviewToEdit ? reviewToEdit?.userEmail || "" : "");
  const [fullName, setFullName] = useState(reviewToEdit ? reviewToEdit?.userFullName || "" : "");

  const { invalidate } = api.useUtils().tripBooking.view;

  const response = useCommonMutationResponse(
    undefined,
    () => {
      invalidate();
      onOpenChange(false);
      onSuccess?.();
      setRating(0);
      setReview("");
    },
    {
      success: t_ToastMessage("SuccessTitle"),
      error: t_ToastMessage("ErrorTitle"),
    },
  );

  const { mutate: addReview, isPending } =
    api.review.create.useMutation(response);

  const { mutate: addUpdateReviewByAdmin, isPending: isAdminPending } =
    (reviewToEdit ? api.review.updateByAdmin : api.review.createByAdmin).useMutation(response);

  const handleSubmit = () => {
    if (isAdmin) {
      if (!email || !fullName) {
        if (!email) {
          alert('Please enter emil.')
        }
        if (!fullName) {
          alert('Enter full name.')
        }
      } else {
        addUpdateReviewByAdmin({
          id: reviewToEdit?.id!,
          email,
          fullName,
          message: review,
          ratingValue: rating,
        });
      }
    } else {
      addReview({
        bookingId,
        message: review,
        ratingValue: rating,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (isPending || isAdminPending || !!disableManualClose) return;

        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mt-2">
            {t("reviewYourTrip", { title })}
          </DialogTitle>
          <DialogDescription>{t("shareExperience")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("ratingLabel")}</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star
                    className={`h-8 w-8 ${star <= (hoveredRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                      }`}
                  />
                  <span className="sr-only">{t("rateStars", { star })}</span>
                </button>
              ))}
            </div>
          </div>

          {isAdmin ?
            <>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t("email")}
                </label>
                <div className="space-y-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={cn(
                      "w-full",
                      email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                    <p className="text-sm text-red-500">{t("Please enter a valid email address")}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  {t("fullName")}
                </label>
                <Input
                  id="fullName"
                  placeholder={t("fullName")}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </> : null
          }

          <div className="space-y-2">
            <label htmlFor="review" className="text-sm font-medium">
              {t("yourReviewLabel")}
            </label>
            <Textarea
              id="review"
              placeholder={t("reviewPlaceholder")}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || isAdminPending || rating < 1 || review.length === 0}
          >
            {isPending || isAdminPending ? t("submitting") : t("submitReview")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
