"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCommonMutationResponse } from "@/hooks/use-common-mutation-response";
import { Link } from "@/i18n/routing";
import { api } from "@/trpc/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export const BookingsList = () => {
  const { data, refetch } = api.tripBooking.adminList.useQuery();

  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<
    "confirm" | "cancel" | "delete"
  >("confirm");

  const response = useCommonMutationResponse(undefined, refetch);

  const { mutate: confirm } =
    api.tripBooking.adminConfirmBooking.useMutation(response);
  const { mutate: cancel } =
    api.tripBooking.adminCancelBooking.useMutation(response);
  const { mutate: markAsDone } =
    api.tripBooking.adminMarkAsDoneBooking.useMutation(response);
  const { mutate: deleteBooking } =
    api.tripBooking.adminDelete.useMutation(response);

  const handleOperation = () => {
    if (selectedBooking) {
      if (selectedOperation === "confirm") {
        confirm(selectedBooking);
      } else if (selectedOperation === "cancel") {
        cancel(selectedBooking);
      } else if (selectedOperation === "delete") {
        deleteBooking(selectedBooking);
      }

      setSelectedBooking(null);
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

  type Booking = NonNullable<typeof data>[number];

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "userPhone",
      header: "User Phone",
    },
    {
      id: "trip",
      header: "Trip",
      cell: ({ row }) => (
        <Link href={`/trips/${row.original.tripId}`}>
          <Button className="p-0" variant="link">
            {row.original.trip.titleEn}
          </Button>
        </Link>
      ),
    },
    {
      id: "travelersCount",
      header: "Travelers Count",
      cell: ({ row }) => (
        <>
          {row.original.adultsCount}
          {row.original.childrenCount !== 0 &&
            ` + ${row.original.childrenCount} children`}
          {row.original.infantsCount !== 0 &&
            ` + ${row.original.infantsCount} infants`}
        </>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => format(row.original.createdAt, "yyyy-MM-dd hh:mm a"),
    },
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.original.status)}>
          {row.original.status.at(0)?.toUpperCase()}
          {row.original.status.slice(1)}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: ({ row: { original: request } }) => (
        <div className="flex gap-2">
          {request.status === "pending" && (
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
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              setSelectedBooking(request.id);
              setSelectedOperation("delete");
            }}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={data ?? []} />
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
                : selectedOperation === "cancel"
                  ? "Cancel request"
                  : "Confirm Deletion"}
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
    </>
  );
};
