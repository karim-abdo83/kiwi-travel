"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { Star, Send, StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUploadThing } from "@/hooks/use-upload-thing";
import { toast } from "@/hooks/use-toast";
import { addReviewFormSchema } from "@/validators/review-schema";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface ReviewFormData {
    message: string;
    ratingValue: number;
    name: string;
    email?: string;
    image: File | null;
}

export function ReviewWriteForm({ onReviewSubmitted, tripId }: { onReviewSubmitted?: () => void, tripId: number }) {
    const t = useTranslations("HomePage.testimonials");

    const imageInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [formData, setFormData] = useState<ReviewFormData>({
        message: "",
        ratingValue: 5,
        name: "",
        email: "",
        image: null,
    });

    const { data, refetch, isLoading: isLoadingReviews } = api.review.listTop.useQuery();

    const { mutate: createReview, isPending: isAddLoading } = api.review.createPublicly.useMutation({
        onSuccess: () => {
            toast({
                title: t("success"),
                description: t("reviewSubmitted"),
            });
            setFormData(prev => ({ ...prev, message: "", ratingValue: 5 }));
            void refetch();
        },
        onError: (error) => {
            toast({
                title: t("error"),
                description: error.message,
                variant: "destructive",
            });
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });

    const { toast } = useToast();

    const { startUpload, isUploading } = useUploadThing("reviewImageUploader", {
        onClientUploadComplete: () => {
            toast({
                title: "Upload complete",
                description: "All files have been uploaded successfully.",
            });
        },
        onUploadError: (error) => {
            toast({
                variant: "destructive",
                title: "Upload failed",
                description: error.message || "Something went wrong with the upload.",
            });
            throw error;
        },
        onUploadProgress: (progress) => { },
    });


    const isAddingReview = isAddLoading || isUploading;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            let imageUrl = null;

            if (formData.image) {
                const res = await startUpload([formData.image]);
                imageUrl = res!.at(0)!.ufsUrl!;
            }

            // Validate the form data
            const validationData = {
                ...formData,
                message: formData.message.trim(),
                image: imageUrl,
                tripId
            };

            const validatedData = addReviewFormSchema.safeParse(validationData);

            if (!validatedData.success) {
                validatedData.error.errors.forEach((error) => {
                    const fieldName = error.path.join('.');
                    toast({
                        title: t("validationError"),
                        description: `${fieldName ? `${fieldName}: ` : ''}${error.message}`,
                        variant: "destructive",
                    });
                });
                return;
            }

            await createReview({...validatedData.data, tripId});

            setFormData({
                message: "",
                ratingValue: 5,
                name: "",
                email: "",
                image: null,
            });

            if (imageInputRef.current) {
                imageInputRef.current.value = '';
            }
            refetch();

        } catch (error: any) {
            setIsSubmitting(false);
            toast({
                title: t("error"),
                description: error?.message || "Something went wrong, plz try again.",
                variant: "destructive",
            });
            console.error("Error submitting review:", error);
        }
    };


    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <Card className="w-full">
                <div className="p-4">
                    <h2 className="text-lg font-semibold">{t("writeReview")}</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-2 p-4">
                        {/* Rating */}
                        <div className="space-y-2">
                            <Label>{t("rating")}</Label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="relative"
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                        onClick={() => setFormData(prev => ({ ...prev, ratingValue: star }))}
                                        disabled={isAddingReview}
                                    >
                                        <StarIcon
                                            className={`h-4 w-4 transition-colors ${(hoveredStar || formData.ratingValue) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">{t("yourName")}</Label>
                            <Input
                                id="name"
                                type="text"
                                disabled={isAddingReview}
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder={t("namePlaceholder")}
                                required
                            />
                        </div>

                        {/* Email*/}
                        <div className="space-y-2">
                            <Label htmlFor="email">{t("email")}</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                disabled={isAddingReview}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                placeholder={t("emailPlaceholder")}
                            />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            {/* <Label htmlFor="message">{t("message")}</Label> */}
                            <Textarea
                                id="message"
                                value={formData.message}
                                disabled={isAddingReview}
                                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                placeholder={t("messagePlaceholder")}
                                rows={4}
                                required
                            />
                        </div>

                        {/* Asset URLs */}
                        <div className="space-y-2 pb-6">
                            <Label htmlFor="image">{t("image")} <span className="text-gray-500">({t("optional")})</span></Label>
                            <input
                                id="image"
                                ref={imageInputRef}
                                name="image"
                                type="file"
                                accept="image/*"
                                disabled={isAddingReview}
                                onChange={(e) => {
                                    if (isAddingReview) return;
                                    const file = e.target.files?.item(0);
                                    if (file && file.size > 5 * 1024 * 1024) {
                                        toast({
                                            variant: "destructive",
                                            title: "File too large",
                                            description: "File size must be less than or equal to 5MB.",
                                        });
                                        return;
                                    }

                                    if (file) {
                                        setFormData(prev => ({ ...prev, image: file }));
                                    }
                                }}
                                className="block file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold
                                 file:bg-gray-100 hover:file:bg-gray-200"
                            />

                            {formData.image && (
                                <div className="mt-2 rounded-lg overflow-hidden">
                                    <img
                                        src={URL.createObjectURL(formData.image)}
                                        alt="Preview"
                                        className="w-full object-contain rounded-lg"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => {
                                    setFormData({
                                        message: "",
                                        ratingValue: 5,
                                        name: "",
                                        email: "",
                                        image: null,
                                    });
                                    if (imageInputRef.current) {
                                        imageInputRef.current.value = '';
                                    }
                                }}
                                disabled={isAddingReview}
                            >
                                {t("cancel")}
                            </Button>
                            <Button
                                type="submit"
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                                disabled={isAddingReview}
                            >
                                {isAddingReview ? (
                                    t("submitting")
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        {t("submitReview")}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
}
