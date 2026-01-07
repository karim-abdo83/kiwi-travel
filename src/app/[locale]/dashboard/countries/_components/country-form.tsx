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
  countryFormSchema,
  CountryFormValues,
} from "@/validators/country-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface CountryFormProps {
  id?: number;
  initialData?: Partial<CountryFormValues>;
}

export function CountryForm({ initialData, id }: CountryFormProps) {
  const { invalidate } = api.useUtils().country.list;
  const mutationResponse = useCommonMutationResponse("/dashboard/countries", invalidate);
  const { mutate: create } =
      api.country.adminCreate.useMutation(mutationResponse);
    const { mutate: update } =
      api.country.adminUpdate.useMutation(mutationResponse);

  // Define form with default values
  const form = useForm<CountryFormValues>({
    resolver: zodResolver(countryFormSchema),
    defaultValues: {
      nameEn: initialData?.nameEn || "",
      nameRu: initialData?.nameRu || "",
      nameTr:initialData?.nameTr || "",
    },
  });

  const handleSubmit = (value: CountryFormValues) => {
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* English Name */}
          <FormField
            control={form.control}
            name="nameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter English name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Russian Name */}
          <FormField
            control={form.control}
            name="nameRu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Russian Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Russian name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Turkish Name */}
          <FormField
            control={form.control}
            name="nameTr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turkish Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Turkish name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto">
          Save Country
        </Button>
      </form>
    </Form>
  );
}
