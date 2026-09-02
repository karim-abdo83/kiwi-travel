import { z } from "zod";
import { attributionRecord } from "@/lib/attribution";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { contactClick } from "@/server/db/schema";

export const contactClickRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        eventId: z.string().uuid(),
        channel: z.enum(["whatsapp", "telegram"]),
        pagePath: z.string().trim().min(1).max(2000),
        ctaLocation: z.string().trim().max(100).optional(),
        tripId: z.number().int().positive().optional(),
        resort: z.string().trim().max(200).optional(),
        attribution: z.string().max(10000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const attribution = attributionRecord(input.attribution);
      await ctx.db
        .insert(contactClick)
        .values({
          eventId: input.eventId,
          channel: input.channel,
          pagePath: input.pagePath,
          ctaLocation: input.ctaLocation,
          tripId: input.tripId,
          resort: input.resort,
          ...attribution,
          initialReferrer: attribution.attributionReferrer,
          latestReferrer: attribution.referrer,
        })
        .onConflictDoNothing();
      return { saved: true };
    }),
});
