"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { mainImage } from "@/lib/utils";
import { api } from "@/trpc/react";
import { api as serverApi } from "@/trpc/server";
import { format } from "date-fns";
import { Check, MapPin, Star, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DatePicker } from "./date-picker";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContent,
} from "@/components/ui/dialog";
import { useCommonMutationResponse } from "@/hooks/use-common-mutation-response";

type Trip = NonNullable<
  Awaited<ReturnType<typeof serverApi.trip.adminViewDetailsPage>>
>;

const REVIEWS_PER_PAGE = 2;

export function TripDetails({ trip }: { trip: Trip }) {
  const [date, setDate] = useState(new Date());
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<
    "confirm" | "cancel"
  >("confirm");

  const { toast } = useToast();

  const { data: bookingRequests, refetch: refetchBookingRequests } =
    api.tripBooking.adminListByDate.useQuery({
      tripId: trip.id,
      date,
    });

  const { data: d, refetch } = api.trip.adminViewDetailsPage.useQuery(trip.id, {
    initialData: trip,
  });

  const data = d!;

  const { mutate: hideReview } = api.review.adminHide.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: ({ message }) => {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const { mutate: unhideReview } = api.review.adminUnhide.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: ({ message }) => {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const response = useCommonMutationResponse(undefined, refetchBookingRequests);

  const { mutate: confirm } =
    api.tripBooking.adminConfirmBooking.useMutation(response);
  const { mutate: cancel } =
    api.tripBooking.adminCancelBooking.useMutation(response);
  const { mutate: markAsDone } =
    api.tripBooking.adminMarkAsDoneBooking.useMutation(response);

  const handleOperation = () => {
    if (selectedBooking) {
      if (selectedOperation === "confirm") {
        confirm(selectedBooking);
      } else {
        cancel(selectedBooking);
      }

      setSelectedBooking(null);
    }
  };

  // Calculate paginated reviews
  const paginatedReviews = () => {
    const startIndex = (currentReviewPage - 1) * REVIEWS_PER_PAGE;
    const endIndex = startIndex + REVIEWS_PER_PAGE;
    return data.reviews.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalReviewPages = Math.ceil(data.reviews.length / REVIEWS_PER_PAGE);

  // Handle page changes
  const goToNextPage = () => {
    if (currentReviewPage < totalReviewPages) {
      setCurrentReviewPage(currentReviewPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentReviewPage > 1) {
      setCurrentReviewPage(currentReviewPage - 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "accepted":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case "missed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  const calculatedReviews = data.reviews.filter((r) => !r.isHiddenByAdmin);
  const totalReviewsCount = calculatedReviews.length;
  const rating =
    calculatedReviews.reduce((acc, current) => acc + current.ratingValue, 0) /
    totalReviewsCount;

  return (
    <div>
      {/* Trip details card */}
      <Card className="mb-6">
        <div className="md:flex">
          <div className="md:w-1/3">
            <Image
              src={mainImage(data.assetsUrls)}
              alt={data.titleEn}
              width={600}
              height={300}
              className="h-72 w-full max-w-[600px] rounded-l-lg object-cover"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{data.titleEn}</h2>
                <div className="mt-1 flex items-center text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{`${data.destination.country.nameEn}, ${data.destination.nameEn}`}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  ${Math.floor(data.adultTripPriceInCents / 100)}
                </Badge>
                {data.isFeatured && <Badge className="text-xs">Featured</Badge>}
              </div>
            </div>

            {!isNaN(rating) && (
              <div className="mt-4 flex items-center">
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{rating.toFixed(2)}</span>
                </div>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {totalReviewsCount} reviews
                </span>
              </div>
            )}

            <p className="mt-4 text-muted-foreground">{data.descriptionEn}</p>
          </div>
        </div>
      </Card>

      {/* Tabs for Booking Requests and Reviews */}
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="requests">Booking Requests</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Booking Requests Tab */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <CardTitle>Booking Requests</CardTitle>
                  <CardDescription>
                    Manage booking requests for this trip
                  </CardDescription>
                </div>

                {/* Date filter */}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <DatePicker date={date} setDate={setDate} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Phone</TableHead>
                      <TableHead>User Email</TableHead>
                      <TableHead>Travelers Count</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookingRequests && bookingRequests.length > 0 ? (
                      bookingRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.userPhone}
                          </TableCell>
                          <TableCell className="font-medium">
                            {request.userEmail}
                          </TableCell>
                          <TableCell>
                            {request.adultsCount}
                            {request.childrenCount !== 0 && ` + ${request.childrenCount} children`}
                            {request.infantsCount !== 0 && ` + ${request.infantsCount} infants`}
                          </TableCell>
                          <TableCell>
                            {request.createdAt.toLocaleDateString("en-Us", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status.at(0)?.toUpperCase()}
                              {request.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex gap-2">
                            {data.isConfirmationRequired &&
                              request.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      setSelectedBooking(request.id);
                                      setSelectedOperation("cancel");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedBooking(request.id);
                                      setSelectedOperation("confirm");
                                    }}
                                  >
                                    Confirm
                                  </Button>
                                </>
                              )}
                            {request.status === "accepted" && (
                              <Button size="sm" onClick={() => markAsDone(request.id)}>
                                Mark as Done
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-4 text-center text-muted-foreground"
                        >
                          No booking requests found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reviews</CardTitle>
                  <CardDescription>
                    See what guests are saying about your trip
                  </CardDescription>
                </div>
                {!isNaN(rating) && (
                  <div className="flex items-center">
                    <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-medium">
                      {rating.toFixed(2)}
                    </span>
                    <span className="ml-2 text-muted-foreground">
                      ({totalReviewsCount} reviews)
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {paginatedReviews().map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start">
                      {review.userImageUrl ? (
                        <Image
                          src={review.userImageUrl}
                          alt={review.userEmail}
                          width={40}
                          height={40}
                          className="mr-4 rounded-full"
                        />
                      ) : (
                        <div className="mr-4 grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
                          <User className="size-6" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {review.userFullName || review.userEmail}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {format(review.createdAt, "yyyy-MM-dd hh:mm a")}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.ratingValue
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-2 text-muted-foreground">
                          {review.message}
                        </p>
                        <div className="mt-3">
                          {review.isHiddenByAdmin ? (
                            <Button onClick={() => unhideReview(review.id)}>
                              Unhide
                            </Button>
                          ) : (
                            <Button
                              onClick={() => hideReview(review.id)}
                              variant="destructive"
                            >
                              Hide
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {data.reviews.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    No reviews for this trip
                  </p>
                )}
              </div>
              {totalReviewPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {currentReviewPage} of {totalReviewPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentReviewPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentReviewPage === totalReviewPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={selectedBooking !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBooking(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedOperation === "confirm"
                ? "Confirm request"
                : "Cancel request"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedOperation} this booking request
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBooking(null)}>
              No
            </Button>
            <Button
              className="capitalize"
              variant={
                selectedOperation === "confirm" ? "default" : "destructive"
              }
              onClick={handleOperation}
            >
              {selectedOperation}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
