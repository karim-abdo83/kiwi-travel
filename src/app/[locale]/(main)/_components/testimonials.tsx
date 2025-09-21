"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { Star, User, MessageSquare, Send, StarIcon, X } from "lucide-react";
import { _createIntlFormatters, useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast, useToast } from "@/hooks/use-toast";
import { addReviewFormSchema } from "@/validators/review-schema";
import { useUploadThing } from "@/hooks/use-upload-thing";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ReviewFormData {
  message: string;
  ratingValue: number;
  name: string;
  email?: string; 
  image: File | null;
  images?: any[]; // For backward compatibility if needed
}

export default function Testimonials() {
  const t = useTranslations("HomePage.testimonials");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [adminReply, setAdminReply] = useState("");
  const [formData, setFormData] = useState<ReviewFormData>({
    message: "",
    ratingValue: 5,
    name: "",
    email: "",
    image: null,
  });

    const { user } = useUser();
  const isAdmin = !!user?.publicMetadata?.isAdmin;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [localAdminReply, setLocalAdminReply] = useState("");
  

  const { data, refetch, isLoading: isLoadingReviews } = api.review.listTop.useQuery();
  
  const {mutate: createReview, isPending: isAddLoading} = api.review.createPublicly.useMutation({
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

  const { startUpload, isUploading } = useUploadThing("fileUploader", {
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
    },
    onUploadProgress: (progress) => {},
  });

  const {mutate: addAdminReply, isPending: isReplyLoading} = api.review.adminReply.useMutation();

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

      // Submit the form if validation passes
      await createReview(validatedData.data);
      
      // Reset form after successful submission
      setFormData({
        message: "",
        ratingValue: 5,
        name: "",
        email: "",
        image: null,
        images: []
      });

      refetch();
      
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        title: t("error"),
        description: error?.message || "Something went wrong, plz try again.",
        variant: "destructive",
      }); 
      console.error("Error submitting review:", error);
      // Error is already handled by the mutation's onError callback
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">{t("sectionTitle")}</h2>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Review Form - Left Side */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-8">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl">{t("writeReview")}</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 p-4">
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
                  <div>
                    <Label  htmlFor="image">{t("images")} <span className="text-gray-500">({t("optional")})</span></Label>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      disabled={isAddingReview}
                      onChange={(e) => {
                        const file = e.target.files?.item(0);
                        if (file) {
                          setFormData(prev => ({ ...prev, image: file }));
                        }
                      }}
                      className="block file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold
                      file:bg-gray-100 hover:file:bg-gray-200"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
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
              </form>
            </Card>
          </div>
          
          {/* Reviews List - Right Side */}
          <div className="w-full lg:w-2/3">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1">
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
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="w-full"
                >
                  <Card className="w-full overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-3">
                    {review.userImageUrl ? (
                      <Image
                        src={review.userImageUrl}
                        alt={review.userEmail || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full h-10 w-10 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-base font-medium">
                        {review.userFullName || t("anonymous")}
                      </CardTitle>
                      <div className="flex items-center">
                        {Array(5).fill(null).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.ratingValue ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-gray-700 text-sm">{review.message}</p>
                  
                  {review.image && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <div 
                          className="aspect-square overflow-hidden rounded-md border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedImage(review.image)}
                        >
                          <img
                            src={review.image}
                            alt="Review"
                            className="h-full w-full object-cover"
                          />
                        </div>
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
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              disabled={!localAdminReply.trim() || isReplyLoading}
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
                          <button
                            onClick={() => {
                              setReplyingTo(review.id);
                              setLocalAdminReply('');
                            }}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>{t('reply') || 'Reply'}</span>
                          </button>
                        )}
                      </>
                    )}
                  </CardFooter>
                )}
              </Card>
            </motion.div>
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
      </div>
      
      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-2 -top-2 z-10 h-8 w-8 rounded-full bg-gray-800/80 hover:bg-gray-700/90 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
            {selectedImage && (
              <div className="max-h-[80vh] max-w-full overflow-auto">
                <img
                  src={selectedImage}
                  alt="Enlarged review"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
