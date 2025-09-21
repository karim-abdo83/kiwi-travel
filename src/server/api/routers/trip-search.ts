import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { trip, destination, country } from "@/server/db/schema";
import { and, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

type SearchResult = {
  id: number;
  slug: string;
  titleEn: string | null;
  titleRu: string | null;
  type: 'trip';
  destination: {
    nameEn: string | null;
    nameRu: string | null;
  };
  country: {
    nameEn: string | null;
    nameRu: string | null;
  };
};

export const tripSearchRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }): Promise<SearchResult[]> => {
      const searchTerm = `%${input}%`;
      
      const results = await ctx.db
        .select({
          id: trip.id,
          slug: trip.slug,
          titleEn: trip.titleEn,
          titleRu: trip.titleRu,
          destination: {
            nameEn: destination.nameEn,
            nameRu: destination.nameRu,
          },
          country: {
            nameEn: country.nameEn,
            nameRu: country.nameRu,
          },
        })
        .from(trip)
        .innerJoin(destination, eq(trip.destinationId, destination.id))
        .innerJoin(country, eq(destination.countryId, country.id))
        .where(
          and(
            eq(trip.isAvailable, true),
            or(
              ilike(trip.titleEn, searchTerm),
              ilike(trip.titleRu, searchTerm),
              ilike(destination.nameEn, searchTerm),
              ilike(destination.nameRu, searchTerm),
              ilike(country.nameEn, searchTerm),
              ilike(country.nameRu, searchTerm)
            )
          )
        )
        .limit(10);

      return results.map(result => ({
        ...result,
        type: 'trip' as const
      }));
    }),
});
