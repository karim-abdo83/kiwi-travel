"use client";

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
import { useToast } from "@/hooks/use-toast";
import { Link } from "@/i18n/routing";
import { api } from "@/trpc/react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";

export function FAQsList() {
  const { toast } = useToast();

  const [faqToDelete, setFAQToDelete] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, refetch } = api.faq.list.useQuery();
  const { mutate: deleteFAQ } = api.faq.adminDelete.useMutation({
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

  type FAQ = NonNullable<typeof data>[number];

  const handleDelete = () => {
    if (faqToDelete) {
      deleteFAQ(faqToDelete);
    }
    setFAQToDelete(null);
    setDialogOpen(false);
  };

  const columns: ColumnDef<FAQ>[] = [
    {
      accessorKey: "questionEn",
      header: "English Question",
    },
    {
      accessorKey: "questionRu",
      header: "Russian Question",
    },
    {
      accessorKey: "questionDe",
      header: "German Question",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const faq = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/faqs/edit/${faq.id}`}>
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setFAQToDelete(faq.id);
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
      <DataTable
        columns={columns}
        data={data ?? []}
        searchColumn="questionEn"
        searchPlaceholder="Search questions..."
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot
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
