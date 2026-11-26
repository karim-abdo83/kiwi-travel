"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCommonMutationResponse } from "@/hooks/use-common-mutation-response";
import { api } from "@/trpc/react";
import {
  TripTypeFormValues,
  tripTypeFormSchema,
} from "@/validators/trip-type-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface TripTypeFormDialogProps {
  initialData?: Partial<TripTypeFormValues>;
  id?: number;
}

export function TripTypeForm({ initialData, id }: TripTypeFormDialogProps) {
  const { invalidate } = api.useUtils().tripType.list;

  const mutationResponse = useCommonMutationResponse(
    "/dashboard/types",
    invalidate,
  );
  const { mutate: create } =
    api.tripType.adminCreate.useMutation(mutationResponse);
  const { mutate: update } =
    api.tripType.adminUpdate.useMutation(mutationResponse);

  const form = useForm<TripTypeFormValues>({
    resolver: zodResolver(tripTypeFormSchema),
    values: {
      nameEn: initialData?.nameEn || "",
      nameRu: initialData?.nameRu || "",
      nameDe: initialData?.nameDe || "",
    },
  });

  const handleSubmit = (value: TripTypeFormValues) => {
    if (initialData && id) {
      update({
        ...value,
        id,
      });
    } else {
      create(value);
    }
  };

  return (
    <Form {...form}>
      <form
        id="trip-type-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* English Content */}
          <FormField
            control={form.control}
            name="nameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Content</FormLabel>
                <FormControl>
                  <Input placeholder="Enter English name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Russian Content */}
          <FormField
            control={form.control}
            name="nameRu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Russian Content</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Russian name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nameDe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>German Content (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter German name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button>Save Type</Button>
      </form>
    </Form>
  );
}
