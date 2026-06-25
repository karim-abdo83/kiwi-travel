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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCommonMutationResponse } from "@/hooks/use-common-mutation-response";
import { useUploadThing } from "@/hooks/use-upload-thing";
import { api } from "@/trpc/react";
import { destinationFormSchema } from "@/validators/destination-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface DestinationFormProps {
  id?: number;
  initialData?: Partial<DestinationFormValues & { imageUrl: string }>;
}

const clientFormSchema = destinationFormSchema.omit({ imageUrl: true });

type DestinationFormValues = z.infer<typeof clientFormSchema>;

export function DestinationForm({ initialData, id }: DestinationFormProps) {
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl ?? "");
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: countries, isLoading: isCountriesLoading } =
    api.country.list.useQuery();

  const { invalidate } = api.useUtils().destination.adminList;
  const mutationResponse = useCommonMutationResponse(
    "/dashboard/destinations",
    invalidate,
  );

  const { mutate: create } =
    api.destination.adminCreate.useMutation(mutationResponse);
  const { mutate: update } =
    api.destination.adminUpdate.useMutation(mutationResponse);

  // Define form with default values
  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      slug: initialData?.slug || "",
      nameEn: initialData?.nameEn || "",
      nameRu: initialData?.nameRu || "",
      nameTr: initialData?.nameTr || "",
      isPopular: initialData?.isPopular || false,
      isFeatured: initialData?.isFeatured || false,
      countryId: initialData?.countryId || ("" as any),
    },
  });

  const { startUpload } = useUploadThing("countryImageUploader");

  const handleSubmit = async (value: DestinationFormValues) => {
    let imageUrl = imagePreview;

    if (image) {
      const res = await startUpload([image]);

      imageUrl = res!.at(0)!.url!;
    }

    if (initialData && id) {
      update({
        ...value,
        imageUrl,
        id,
      });
    } else {
      create({
        ...value,
        imageUrl,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== initialData?.imageUrl) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          rules={{
            required: true,
            pattern: {
              value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message:
                "Slug must contain only lowercase letters, numbers, and hyphens",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="Enter slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

          {/* Country */}
          <FormField
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Country</FormLabel>
                <Select
                  disabled={isCountriesLoading}
                  defaultValue={field.value.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries?.map((country) => (
                      <SelectItem
                        key={country.id}
                        value={country.id.toString()}
                      >
                        {country.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image */}
          <div className="flex flex-col gap-4">
            <Label>Image</Label>
            <div className="flex items-center gap-2">
              {imagePreview && (
                <img
                  className="h-20 w-24 rounded-md bg-slate-400 object-cover"
                  src={imagePreview}
                  alt="image preview"
                />
              )}
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                type="button"
              >
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                accept="image/*"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.item(0);
                  const oldImagePreview = imagePreview;

                  if (file) {
                    setImage(file);
                    setImagePreview(URL.createObjectURL(file));
                  }

                  if (oldImagePreview) {
                    URL.revokeObjectURL(oldImagePreview);
                  }
                }}
              />
            </div>
          </div>

          {/* Is it popular */}
          <FormField
            control={form.control}
            name="isPopular"
            render={({ field }) => (
              <FormItem className="-mt-2 flex items-center gap-2">
                <FormControl>
                  <Switch
                    className="mt-2"
                    name={field.name}
                    ref={field.ref}
                    disabled={field.disabled}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Popular Destination</FormLabel>
              </FormItem>
            )}
          />

          {/* Is it featured */}
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="-mt-2 flex items-center gap-2">
                <FormControl>
                  <Switch
                    className="mt-2"
                    name={field.name}
                    ref={field.ref}
                    disabled={field.disabled}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Featured</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto">
          Save Destination
        </Button>
      </form>
    </Form>
  );
}
