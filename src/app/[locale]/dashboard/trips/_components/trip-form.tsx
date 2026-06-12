"use client";

import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCommonMutationResponse } from "@/hooks/use-common-mutation-response";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/hooks/use-upload-thing";
import { api } from "@/trpc/react";
import { days, tripFormSchema } from "@/validators/trip-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { RichTextEditor } from "./rich-text-editor";
import UploadFilesField, { AssetFile } from "./upload-files-field";
import {
  UploadProgressDialog,
  type FileWithProgress,
} from "./upload-progress-dialog";

const clientFormSchema = tripFormSchema.omit({ assets: true });

type TripFormValues = z.infer<typeof clientFormSchema>;

interface TripFormProps {
  id?: number;
  initialData?: Partial<TripFormValues & { assets: string[] }>;
}

export function TripForm({ initialData, id }: TripFormProps) {
  const { data: destinations, isLoading: isDestinationsLoading } =
    api.destination.adminList.useQuery();
  const { data: tripFeatures, isLoading: isTripFeaturesLoading } =
    api.tripFeature.adminList.useQuery();
  const { data: tripTypes, isLoading: isTripTypesLoading } =
    api.tripType.list.useQuery();

  const { invalidate } = api.useUtils().trip.adminList;

  const mutationResponse = useCommonMutationResponse("/dashboard/trips", invalidate);
  const { mutate: create } = api.trip.adminCreate.useMutation(mutationResponse);
  const { mutate: update } = api.trip.adminUpdate.useMutation(mutationResponse);

  const [currentUploadingFileIndex, setCurrentUploadingFileIndex] = useState(0);
  const [filesWithProgress, setFilesWithProgress] = useState<
    FileWithProgress[]
  >([]);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [assets, setAssets] = useState<AssetFile[]>(
    initialData?.assets?.map((asset) => ({
      preview: asset,
      // as we mentioned in the `trip` table schema
      // each asset url has a query param at the end
      // refers to the type
      isVideo: asset.endsWith("?type=video"),
      isInitialData: true,
    })) ?? [],
  );
  const { toast } = useToast();

  const { startUpload, isUploading } = useUploadThing("fileUploader", {
    onClientUploadComplete: () => {
      toast({
        title: "Upload complete",
        description: "All files have been uploaded successfully.",
      });

      // Mark all files as complete
      setFilesWithProgress((current) =>
        current.map((file) => ({
          ...file,
          progress: 100,
          complete: true,
        })),
      );

      // Only close dialog on success after a short delay
      setTimeout(() => {
        setProgressDialogOpen(false);
        setFilesWithProgress([]);
        setCurrentUploadingFileIndex(0);
      }, 1000);
    },
    onUploadError: (error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Something went wrong with the upload.",
      });

      // Mark current file as having an error
      setFilesWithProgress((current) =>
        current.map((file, index) =>
          index === currentUploadingFileIndex
            ? { ...file, error: error.message || "Upload failed" }
            : file,
        ),
      );
    },
    onUploadProgress: (progress) => {
      setFilesWithProgress((current) =>
        current.map((file, index) => {
          if (index === currentUploadingFileIndex) {
            const isComplete = progress === 100;

            // If this file is complete, increment the current file index
            if (isComplete && index === currentUploadingFileIndex) {
              setCurrentUploadingFileIndex((prev) => prev + 1);
            }

            return {
              ...file,
              progress,
              complete: isComplete,
            };
          }
          return file;
        }),
      );
    },
  });

  // Calculate overall progress based on all files
  const overallProgress = filesWithProgress.length
    ? filesWithProgress.reduce((acc, file) => acc + file.progress, 0) /
      filesWithProgress.length
    : 0;

  useEffect(() => {
    return () => {
      assets.forEach((f) => {
        if (!f.isInitialData) {
          URL.revokeObjectURL(f.preview);
        }
      });
    };
  }, []);

  // Define form with default values
  const form = useForm<TripFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      slug: initialData?.slug || "",
      titleEn: initialData?.titleEn || "",
      titleRu: initialData?.titleRu || "",
      titleTr: initialData?.titleTr || "",
      descriptionEn: initialData?.descriptionEn || "",
      descriptionRu: initialData?.descriptionRu || "",
      descriptionTr: initialData?.descriptionTr || "",
      longDescriptionEn: initialData?.longDescriptionEn || "",
      longDescriptionRu: initialData?.longDescriptionRu || "",
      longDescriptionTr: initialData?.longDescriptionTr || "",
      features: initialData?.features || [],
      travelTime: initialData?.travelTime || "00:00",
      destinationId: initialData?.destinationId || ("" as any),
      adultPrice: initialData?.adultPrice || 0,
      childPrice: initialData?.childPrice || 0,
      childAge: initialData?.childAge || "",
      infantAge: initialData?.infantAge || "",
      availableDays: initialData?.availableDays || [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      duration: initialData?.duration || "",
      isAvailable: initialData?.isAvailable || true,
      isFeatured: initialData?.isFeatured || false,
      isConfirmationRequired: initialData?.isConfirmationRequired || false,
      tripTypes: initialData?.tripTypes || [],
      ticketTypes: initialData?.ticketTypes ?? [],
      // pickup and place of return
      pickupPointEn: initialData?.pickupPointEn || "",
      pickupPointRu: initialData?.pickupPointRu || "",
      pickupPointTr: initialData?.pickupPointTr || "",
      placeOfReturnEn: initialData?.placeOfReturnEn || "",
      placeOfReturnRu: initialData?.placeOfReturnRu || "",
      placeOfReturnTr: initialData?.placeOfReturnTr || "",
      // size of trip
      sizeOfTrip: initialData?.sizeOfTrip || "",
    },
  });

  const {
    fields: ticketTypeFields,
    append: appendTicketType,
    remove: removeTicketType,
  } = useFieldArray({
    control: form.control,
    name: "ticketTypes",
  });

  const getAssets = async () => {
    const files = assets
      .filter((asset) => !asset.isInitialData)
      // here we wrote `as unknown as File` because when the file is not in the initial data
      // it will be a File object also
      .map((asset) => asset as unknown as File);

    if (files.length === 0) return assets.map((asset) => asset.preview);

    const selectedFiles = files.map((file) => ({
      file,
      progress: 0,
    }));

    setFilesWithProgress(selectedFiles);
    setCurrentUploadingFileIndex(0);
    setProgressDialogOpen(true);

    const res = (await startUpload(files))!;

    let currentResultIndex = 0;

    return assets.map((asset) =>
      asset.isInitialData
        ? asset.preview
        : `${res[currentResultIndex++]!.url}?type=${asset.isVideo ? "video" : "image"}`,
    );
  };

  const handleSubmit = async (value: TripFormValues) => {
    try {
      // Ensure slug is properly formatted
      const formattedValue = {
        ...value,
        // Ensure slug is trimmed and in lowercase with hyphens
        slug: value.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      };
      const submitValue = {
        ...formattedValue,
      };

      if (initialData?.ticketTypes === undefined) {
        delete submitValue.ticketTypes;
      }

      const assets = await getAssets();

      if (assets.length === 0) {
        toast({
          variant: "destructive",
          title: "Invalid Assets",
          description: "You must provide at least one asset for your trip",
        });
        return;
      }

      if (initialData && id) {
        await update({
          ...submitValue,
          id,
          assets,
        });
      } else {
        await create({
          ...submitValue,
          assets,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while saving the trip. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          rules={{ 
            required: "Slug is required",
            pattern: {
              value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: "Slug must be a valid URL slug (lowercase letters, numbers, and hyphens only)",
            },
            minLength: {
              value: 3,
              message: "Slug must be at least 3 characters long",
            },
            maxLength: {
              value: 50,
              message: "Slug must be less than 50 characters",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="my-awesome-trip" 
                    {...field} 
                    onChange={(e) => {
                      // Automatically format the slug as user types
                      const value = e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '');
                      field.onChange(value);
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription>
                A URL-friendly version of the title. Only lowercase letters, numbers, and hyphens are allowed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* English Title */}
          <FormField
            control={form.control}
            name="titleEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter English title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Russian Title */}
          <FormField
            control={form.control}
            name="titleRu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Russian Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Russian title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* turkish Title */}
           <FormField
            control={form.control}
            name="titleTr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turkish Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Turkish title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* English Description */}
          <FormField
            control={form.control}
            name="descriptionEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter English description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Russian Description */}
          <FormField
            control={form.control}
            name="descriptionRu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Russian Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter Russian description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           {/* Turkish Description */}
          <FormField
            control={form.control}
            name="descriptionTr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turkish Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter Turkish description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* English Long Description */}
          <FormField
            control={form.control}
            name="longDescriptionEn"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>English Long Description</FormLabel>
                <FormControl>
                  <RichTextEditor
                    placeholder="Enter detailed English description"
                    content={field.value}
                    setContent={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Russian Long Description */}
          <FormField
            control={form.control}
            name="longDescriptionRu"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Russian Long Description</FormLabel>
                <FormControl>
                  <RichTextEditor
                    placeholder="Enter detailed Russian description"
                    content={field.value}
                    setContent={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Turkish Long Description */}
          <FormField
            control={form.control}
            name="longDescriptionTr"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Turkish Long Description</FormLabel>
                <FormControl>
                  <RichTextEditor
                    placeholder="Enter detailed Turkish description"
                    content={field.value}
                    setContent={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Features */}
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Features</FormLabel>
                <FormControl>
                  <MultiSelect
                    disabled={isTripFeaturesLoading}
                    options={
                      tripFeatures?.map((f) => ({
                        label: f.contentEn,
                        value: f.id.toString(),
                      })) ?? []
                    }
                    defaultValue={field.value?.map((v) => v.toString())}
                    onValueChange={(value) => field.onChange(value.map(Number))}
                    placeholder="Select features"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Asset URLs */}
          <UploadFilesField assets={assets} setAssets={setAssets} />
          <UploadProgressDialog
            open={progressDialogOpen}
            setOpen={setProgressDialogOpen}
            files={filesWithProgress}
            isUploading={isUploading}
            overallProgress={overallProgress}
          />

          {/* Available Days */}
          <FormField
            control={form.control}
            name="availableDays"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Available Days</FormLabel>
                <FormControl>
                  <ToggleGroup
                    variant="outline"
                    className="justify-start"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    type="multiple"
                  >
                    {days.map((day) => (
                      <ToggleGroupItem value={day} key={day}>
                        {day}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Travel Time */}
          <FormField
            control={form.control}
            name="travelTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travel Time</FormLabel>
                <FormControl>
                  <Input type="time" placeholder="HH:MM" {...field} />
                </FormControl>
                <FormDescription>Format: HH:MM</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Duration" {...field} />
                </FormControl>
                <FormDescription>
                  Use <span className="text-foreground">day</span>,{" "}
                  <span className="text-foreground">days</span>,{" "}
                  <span className="text-foreground">hour</span> and{" "}
                  <span className="text-foreground">hours</span> for
                  translation, (e.g. 1 day, 3 hours)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        
         {/* Size of trip */}
            <FormField
            control={form.control}
            name="sizeOfTrip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size of Trip</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Size of Trip" {...field} />
                </FormControl>
                <FormDescription>
                  Use <span className="text-foreground">person</span>,{" "}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Destination ID */}
          <FormField
            control={form.control}
            name="destinationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(Number.parseInt(value))
                  }
                  defaultValue={field.value.toString()}
                  disabled={isDestinationsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {destinations?.map((destination) => (
                      <SelectItem
                        key={destination.id}
                        value={destination.id.toString()}
                      >
                        {`${destination.country.nameEn}, ${destination.nameEn}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Trip Type */}
          <FormField
            control={form.control}
            name="tripTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Types</FormLabel>
                <FormControl>
                  <MultiSelect
                    disabled={isTripTypesLoading}
                    options={
                      tripTypes?.map((f) => ({
                        label: f.nameEn,
                        value: f.id.toString(),
                      })) ?? []
                    }
                    defaultValue={field.value?.map((v) => v.toString())}
                    onValueChange={(value) => field.onChange(value.map(Number))}
                    placeholder="Select trip types"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* English Pickup Point */}
          <FormField
            control={form.control}
            name="pickupPointEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Pickup Point</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter English pickup point" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Russian Pickup Point */}
          <FormField
            control={form.control}
            name="pickupPointRu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Russian Pickup Point</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter Russian pickup point" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           {/* Turkish Pickup Point */}
          <FormField
            control={form.control}
            name="pickupPointTr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turkish Pickup Point</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter Turkish pickup point" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* English Place of Return */}
          <FormField
            control={form.control}
            name="placeOfReturnEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Place of Return</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter English place of return" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Russian Place of Return */}
          <FormField
            control={form.control}
            name="placeOfReturnRu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Russian Place of Return</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter Russian place of return" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Turkish Place of Return */}
          <FormField
            control={form.control}
            name="placeOfReturnTr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turkish Place of Return</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter Turkish place of return" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Adult Trip Price */}
          <FormField
            control={form.control}
            name="adultPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adult Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || '')}
                  />
                </FormControl>
                <FormDescription>Enter the price (e.g. 10.00)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Child Trip Price */}
          <FormField
            control={form.control}
            name="childPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Child Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || '')}
                  />
                </FormControl>
                <FormDescription>Enter the price (e.g. 10.00)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Child Age */}
          <FormField
            control={form.control}
            name="childAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Child Age</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter age"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter the age or keep it empty if child is not included in the trip plan</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Infant Age */}
          <FormField
            control={form.control}
            name="infantAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Infant Age</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter age"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter the age or keep it empty if infant is not included in the trip plan</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {id && (
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Ticket Types</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Manage dynamic ticket types for this trip. The old Adult, Child and Infant prices remain unchanged.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendTicketType({
                        nameEn: "",
                        nameRu: "",
                        price: 0,
                        sortOrder: ticketTypeFields.length,
                        isActive: true,
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Ticket
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticketTypeFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No ticket types yet. Add tickets here when you are ready to manage dynamic pricing.
                  </p>
                ) : (
                  ticketTypeFields.map((ticketTypeField, index) => (
                    <div
                      key={ticketTypeField.id}
                      className="grid gap-4 rounded-lg border p-4 md:grid-cols-12"
                    >
                      <FormField
                        control={form.control}
                        name={`ticketTypes.${index}.nameEn`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-3">
                            <FormLabel>Name EN</FormLabel>
                            <FormControl>
                              <Input placeholder="Adult" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`ticketTypes.${index}.nameRu`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-3">
                            <FormLabel>Name RU</FormLabel>
                            <FormControl>
                              <Input placeholder="Adult" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`ticketTypes.${index}.price`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`ticketTypes.${index}.sortOrder`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Sort Order</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end gap-3 md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`ticketTypes.${index}.isActive`}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 pb-2">
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
                              <FormLabel>Active</FormLabel>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="mb-1"
                          onClick={() => removeTicketType(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Is it available */}
          <FormField
            control={form.control}
            name="isAvailable"
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
                <FormLabel>Available</FormLabel>
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

          {/* Is confirmation action required */}
          <FormField
            control={form.control}
            name="isConfirmationRequired"
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
                <FormLabel>Required Confirmation</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Save Trip
        </Button>
      </form>
    </Form>
  );
}
