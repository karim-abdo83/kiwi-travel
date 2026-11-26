"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";

export function TripsFeaturesList() {
  const { toast } = useToast();

  const [featureToDelete, setFeatureToDelete] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, refetch } = api.tripFeature.adminList.useQuery();
  const { mutate: deleteFeature } = api.tripFeature.adminDelete.useMutation({
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

  type Feature = NonNullable<typeof data>[number];

  const handleDelete = () => {
    if (featureToDelete) {
      deleteFeature(featureToDelete);
    }

    setFeatureToDelete(null);
    setDialogOpen(false);
  };

  const columns: ColumnDef<Feature>[] = [
    {
      accessorKey: "contentEn",
      header: "English Content",
    },
    {
      accessorKey: "contentRu",
      header: "Russian Content",
    },
    {
      accessorKey: "contentDe",
      header: "German Content",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const feature = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/features/edit/${feature.id}`}>
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setFeatureToDelete(feature.id);
                setDialogOpen(true);
              }}
            >
              <Trash className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={data ?? []} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this feature? This action cannot
              be undone.
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
    </>
  );
}
