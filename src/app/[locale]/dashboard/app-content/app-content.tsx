"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react"
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  popularDestinationEn: z.string().min(1, {
    message: "Title is required",
  }),
  popularDestinationRu: z.string().min(1, {
    message: "Title is required",
  }),
  popularDestinationTr: z.string().min(1, {
    message: "Title is required",
  }),
});

export default function AppContent() {
  const t = useTranslations("Admin.Settings");
  const router = useRouter();
  const { data, isLoading } = api.appContent.get.useQuery();
  const {mutate: updateSetting, isPending: isUpdatingSetting} = api.appContent.update.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      popularDestinationEn: data?.popularDestinationEn  || '',
      popularDestinationRu: data?.popularDestinationRu  || '',
      popularDestinationTr: data?.popularDestinationTr  || '',
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        popularDestinationEn: data.popularDestinationEn,
        popularDestinationRu: data.popularDestinationRu,
        popularDestinationTr: data.popularDestinationTr,
      });
    }
  }, [data]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateSetting({
        en: values.popularDestinationEn,
        ru: values.popularDestinationRu,
        tr: values.popularDestinationTr,
      });

      toast({
        title: t("settingsUpdated"),
        variant: "default",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: t("updateError"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
            <FormField
              control={form.control}
              name="popularDestinationEn"
              render={({ field }) => (
              <FormItem>
                <FormLabel>Popular Destination Title(En)</FormLabel>
                <FormControl>
                  <Input disabled={isUpdatingSetting} placeholder="Enter Popular Destination Title (En)" {...field} />
                </FormControl>
                {/* <FormDescription>
                  {t("popularDestinationsDescription")}
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="popularDestinationRu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Popular Destination Title (Ru)</FormLabel>
                <FormControl>
                  <Input disabled={isUpdatingSetting} placeholder="Enter Popular Destination Title (Ru)" {...field} />
                </FormControl>
                {/* <FormDescription>
                  {t("popularDestinationsDescription")}
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

           <FormField
            control={form.control}
            name="popularDestinationTr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Popular Destination Title (Tr)</FormLabel>
                <FormControl>
                  <Input disabled={isUpdatingSetting} placeholder="Enter Popular Destination Title (Tr)" {...field} />
                </FormControl>
                {/* <FormDescription>
                  {t("popularDestinationsDescription")}
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isUpdatingSetting}>
            {isUpdatingSetting ? t("saving") : t("saveChanges")}
          </Button>
        </form>
      </Form>
      )}
    </div>
  );
}
