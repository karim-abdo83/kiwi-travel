"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, CircleX, Edit, Eye, Trash } from "lucide-react";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { PLACEHOLDER_IMAGE } from "@/constants";


export function TripsList() {
  const { toast } = useToast();

  const { data, refetch } = api.trip.adminList.useQuery();
  const { mutate: deleteTrip } = api.trip.adminDelete.useMutation({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: ({ message }) => {
      toast({
        title: "Success",
        description: message,
      });
      refetch();
    },
  });

  type Trip = NonNullable<typeof data>[number];

  const [tripToDelete, setTripToDelete] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = () => {
    if (tripToDelete) {
      deleteTrip(tripToDelete);
    }

    setTripToDelete(null);
    setDialogOpen(false);
  };

  const columns: ColumnDef<Trip>[] = [
    {
      accessorKey: "title",
      header: "Trip",
      cell: ({ row }) => {
        const trip = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-md">
              <img
                src={trip.assetsUrls[0] || PLACEHOLDER_IMAGE}
                alt={trip.titleEn}
                className="size-10 object-cover"
              />
            </div>
            <span className="font-medium">{trip.titleEn}</span>
          </div>
        );
      },
    },
    // for search ability
    {
      accessorKey: "titleEn",
    },
    {
      id: "destination",
      header: "Destination",
      cell: ({ row }) => {
        const feature = row.original;

        return `${feature.destination.country.nameEn}, ${feature.destination.nameEn}`;
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => "$" + row.original.adultTripPriceInCents / 100,
    },
    {
      accessorKey: "isAvailable",
      header: "Available",
      cell: ({ row }) => (
        <div className="ml-5">
          {row.original.isAvailable ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <CircleX className="text-destructive" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "isFeatured",
      header: "Featured",
      cell: ({ row }) => (
        <div className="ml-5">
          {row.original.isFeatured ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <CircleX className="text-destructive" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "isConfirmationRequired",
      header: "Confirmation",
      cell: ({ row }) => (
        <div className="ml-5">
          {row.original.isConfirmationRequired ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <CircleX className="text-destructive" />
          )}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const trip = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/dashboard/trips/${trip.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link href={`/dashboard/trips/edit/${trip.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                setTripToDelete(trip.id);
                setDialogOpen(true);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        hiddenColumns={["titleEn"]}
        data={data ?? []}
        searchColumn="titleEn"
        searchPlaceholder="Search trips..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trip? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
