"use client";

import { useCommonMutationResponse } from "@/hooks/use-common-mutation-response";
import { api } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewId: number;
  isAdmin?: boolean;
  onSuccess?: () => void;
}

export function DeleteDialog({
  open,
  onOpenChange,
  reviewId,
  onSuccess,
  isAdmin = false,
}: DeleteDialogProps) {
  const t = useTranslations("DeleteReviewDialog");
  const t_ToastMessage = useTranslations("ToastMessages");

  const { invalidate } = api.useUtils().tripBooking.view;

  const response = useCommonMutationResponse(
    undefined,
    () => {
      if (!isAdmin) {
        invalidate();
      }
      onOpenChange(false);
      onSuccess?.();
    },
    {
      success: t_ToastMessage("SuccessTitle"),
      error: t_ToastMessage("ErrorTitle"),
    },
  );

  const { mutate: deleteReview, isPending } =
    (isAdmin ? api.review.deleteByAdmin : api.review.delete).useMutation(response);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (isPending) return;

        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mt-2">{t("deleteReviewTitle")}</DialogTitle>
          <DialogDescription>{t("deleteReviewDescription")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteReview(reviewId)}
            disabled={isPending}
          >
            {isPending ? t("deleting") : t("confirmDeletion")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
