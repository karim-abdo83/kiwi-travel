"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "@/i18n/routing";
import { api } from "@/trpc/react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";

export function CountriesList() {
  const { toast } = useToast();

  const [countryToDelete, setCountryToDelete] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, refetch } = api.country.list.useQuery();
  const { mutate: deleteCountry } = api.country.adminDelete.useMutation({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      setCountryToDelete(null)
      setDialogOpen(false)
    },
    onSuccess: ({ message }) => {
      toast({
        title: "Success",
        description: message,
      })
      setCountryToDelete(null)
      setDialogOpen(false)
      refetch()
    },
  });

  type Country = NonNullable<typeof data>[number];

  const handleDelete = () => {
    if (countryToDelete) {
      deleteCountry(countryToDelete)
    }
  };

  const columns: ColumnDef<Country>[] = [
    {
      accessorKey: "nameEn",
      header: "English Name",
    },
    {
      accessorKey: "nameRu",
      header: "Russian Name",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const country = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/countries/edit/${country.id}`}>
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setCountryToDelete(country.id);
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
              Are you sure you want to delete this country? This action cannot be undone.
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
