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
  TripFeatureFormValues,
  tripFeatureFormSchema,
} from "@/validators/trip-feature-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface TripFeatureFormDialogProps {
  initialData?: Partial<TripFeatureFormValues>;
  id?: number;
}

export function TripFeatureForm({
  initialData,
  id,
}: TripFeatureFormDialogProps) {
  const { invalidate } = api.useUtils().tripFeature.adminList;

  const mutationResponse = useCommonMutationResponse(
    "/dashboard/features",
    invalidate,
  );
  const { mutate: create } =
    api.tripFeature.adminCreate.useMutation(mutationResponse);
  const { mutate: update } =
    api.tripFeature.adminUpdate.useMutation(mutationResponse);

  const form = useForm<TripFeatureFormValues>({
    resolver: zodResolver(tripFeatureFormSchema),
    values: {
      contentEn: initialData?.contentEn || "",
      contentRu: initialData?.contentRu || "",
      contentDe: initialData?.contentDe || "",
    },
  });

  const handleSubmit = (value: TripFeatureFormValues) => {
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
        id="trip-feature-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* English Content */}
          <FormField
            control={form.control}
            name="contentEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Content</FormLabel>
                <FormControl>
                  <Input placeholder="Enter English content" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Russian Content */}
          <FormField
            control={form.control}
            name="contentRu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Russian Content</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Russian content" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contentDe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>German Content (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter German content" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button>Save Feature</Button>
      </form>
    </Form>
  );
}
