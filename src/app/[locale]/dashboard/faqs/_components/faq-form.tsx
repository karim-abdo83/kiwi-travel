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
import { Textarea } from "@/components/ui/textarea";
import { useCommonMutationResponse } from "@/hooks/use-common-mutation-response";
import { api } from "@/trpc/react";
import { faqFormSchema, FAQFormValues } from "@/validators/faq-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface FAQFormProps {
  id?: number;
  initialData?: Partial<FAQFormValues>;
}

export function FAQForm({ initialData, id }: FAQFormProps) {
  const { invalidate } = api.useUtils().faq.list;
  const mutationResponse = useCommonMutationResponse(
    "/dashboard/faqs",
    invalidate,
  );
  const { mutate: create } = api.faq.adminCreate.useMutation(mutationResponse);
  const { mutate: update } = api.faq.adminUpdate.useMutation(mutationResponse);

  // Define form with default values
  const form = useForm<FAQFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      questionEn: initialData?.questionEn || "",
      questionRu: initialData?.questionRu || "",
      questionDe: initialData?.questionDe || "",
      answerEn: initialData?.answerEn || "",
      answerRu: initialData?.answerRu || "",
      answerDe: initialData?.answerDe || "",
    },
  });

  const handleSubmit = (value: FAQFormValues) => {
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
          {/* English Question */}
          <FormField
            control={form.control}
            name="questionEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Question</FormLabel>
                <FormControl>
                  <Input placeholder="Enter english question" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Russian Question */}
          <FormField
            control={form.control}
            name="questionRu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Russian Question</FormLabel>
                <FormControl>
                  <Input placeholder="Enter russian question" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="questionDe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>German Question (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter German question" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* English Question */}
          <FormField
            control={form.control}
            name="answerEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Answer</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter english answer"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Russian Question */}
          <FormField
            control={form.control}
            name="answerRu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Russian Answer</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter russian answer"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="answerDe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>German Answer (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter German answer"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto">
          Save Question
        </Button>
      </form>
    </Form>
  );
}
