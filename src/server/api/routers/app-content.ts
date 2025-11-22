import { z } from "zod";
import { createTRPCRouter, adminProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { appContent as appContentTableSchema } from "@/server/db/schema";
import { getTranslations } from "next-intl/server";
import { eq } from "drizzle-orm";

export const appContentRouter = createTRPCRouter({
  // Get setting by ID
  get: publicProcedure
    .query(async ({ ctx }) => {
      const setting = await ctx.db.query.appContent.findFirst();

      if (!setting) {
        const newSetting = await ctx.db.insert(appContentTableSchema).values({
          popularDestinationEn: "Popular Destinations",
          popularDestinationRu: "Популярные направления",
          popularDestinationTr: "Popüler Destinasyonlar",
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        return newSetting?.[0];
      }

      return setting;
    }),

  // Update setting by ID
  update: adminProcedure
    .input(z.object({ en: z.string(), ru: z.string(), tr: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingSetting = await ctx.db.query.appContent.findFirst();

      if (!existingSetting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Setting not found",
        });
      }

      await ctx.db.update(appContentTableSchema).set({
        popularDestinationEn: input.en,
        popularDestinationRu: input.ru,
        popularDestinationTr: input.tr,
        updatedAt: new Date(),
      }).where(eq(appContentTableSchema.id, existingSetting.id));

      const t = await getTranslations("ToastMessages");

      return {
        message: t("UpdateSetting"),
      };
    }),
});
