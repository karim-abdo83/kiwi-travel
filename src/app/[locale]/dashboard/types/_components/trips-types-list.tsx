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

export function TripsTypesList() {
  const { toast } = useToast();

  const [typeToDelete, setTypeToDelete] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, refetch } = api.tripType.list.useQuery();
  const { mutate: deleteType } = api.tripType.adminDelete.useMutation({
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

  type Type = NonNullable<typeof data>[number];

  const handleDelete = () => {
    if (typeToDelete) {
      deleteType(typeToDelete);
    }

    setTypeToDelete(null);
    setDialogOpen(false);
  };

  const columns: ColumnDef<Type>[] = [
    {
      accessorKey: "nameEn",
      header: "English Name",
    },
    {
      accessorKey: "nameRu",
      header: "Russian Name",
    },
    {
      accessorKey: "nameDe",
      header: "German Name",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const type = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/types/edit/${type.id}`}>
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setTypeToDelete(type.id);
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
              Are you sure you want to delete this type? This action cannot be
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
    </>
  );
}
