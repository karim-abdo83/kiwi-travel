import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { trip, destination, country } from "@/server/db/schema";
import { and, eq, ilike, or, sql } from "drizzle-orm";
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

  searchExtended: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const q = input.trim();
      if (q.length < 2) return [];
  
      const searchTerm = `%${q}%`;
  
      // Destinations (high priority)
      const destinations = await ctx.db
        .select({
          id: destination.id,
          slug: destination.slug,
          nameEn: destination.nameEn,
          nameRu: destination.nameRu,
          countryNameEn: country.nameEn,
          countryNameRu: country.nameRu,
          score: sql<number>`CASE 
            WHEN lower(${destination.nameEn}) = lower(${q}) THEN 3
            WHEN ${ilike(destination.nameEn, searchTerm)} OR ${ilike(destination.nameRu, searchTerm)} THEN 2
            WHEN ${ilike(country.nameEn, searchTerm)} OR ${ilike(country.nameRu, searchTerm)} THEN 1
            ELSE 0 END`,
        })
        .from(destination)
        .innerJoin(country, eq(destination.countryId, country.id))
        .where(
          or(
            ilike(destination.nameEn, searchTerm),
            ilike(destination.nameRu, searchTerm),
            ilike(country.nameEn, searchTerm),
            ilike(country.nameRu, searchTerm)
          )
        )
        .limit(10);
  
      const destinationResults = destinations.map((d) => ({
        id: d.id,
        type: "destination" as const,
        slug: d.slug,
        nameEn: d.nameEn,
        nameRu: d.nameRu,
        countryNameEn: d.countryNameEn,
        countryNameRu: d.countryNameRu,
        score: d.score,
        iconKey: "location",
      }));
  
      // Trips
      const trips = await ctx.db
        .select({
          id: trip.id,
          slug: trip.slug,
          titleEn: trip.titleEn,
          titleRu: trip.titleRu,
          destinationNameEn: destination.nameEn,
          destinationNameRu: destination.nameRu,
          countryNameEn: country.nameEn,
          countryNameRu: country.nameRu,
          score: sql<number>`CASE
            WHEN lower(${trip.titleEn}) = lower(${q}) THEN 2
            WHEN ${ilike(trip.titleEn, searchTerm)} OR ${ilike(trip.titleRu, searchTerm)} THEN 1
            ELSE 0 END`,
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
              ilike(trip.descriptionEn, searchTerm),
              ilike(trip.descriptionRu, searchTerm),
              ilike(destination.nameEn, searchTerm),
              ilike(destination.nameRu, searchTerm),
              ilike(country.nameEn, searchTerm),
              ilike(country.nameRu, searchTerm)
            )
          )
        )
        .limit(10);
  
      const tripResults = trips.map((t) => ({
        id: t.id,
        type: "trip" as const,
        slug: t.slug,
        titleEn: t.titleEn,
        titleRu: t.titleRu,
        destinationNameEn: t.destinationNameEn,
        destinationNameRu: t.destinationNameRu,
        countryNameEn: t.countryNameEn,
        countryNameRu: t.countryNameRu,
        score: t.score,
        iconKey: "trip",
      }));
  
      // Merge + rank by score
      const combined = [...destinationResults, ...tripResults].sort(
        (a, b) => b.score - a.score
      );
  
      return combined.slice(0, 20);
    }),
  
  // searchExtended: publicProcedure
  //   .input(z.string().min(1))
  //   .query(async ({ ctx, input }): Promise<SearchResult[]> => {
  //     const searchTerm = `%${input}%`;
      
  //     const results = await ctx.db
  //       .select({
  //         id: trip.id,
  //         slug: trip.slug,
  //         titleEn: trip.titleEn,
  //         titleRu: trip.titleRu,
  //         destination: {
  //           nameEn: destination.nameEn,
  //           nameRu: destination.nameRu,
  //         },
  //         country: {
  //           nameEn: country.nameEn,
  //           nameRu: country.nameRu,
  //         },
  //       })
  //       .from(trip)
  //       .innerJoin(destination, eq(trip.destinationId, destination.id))
  //       .innerJoin(country, eq(destination.countryId, country.id))
  //       .where(
  //         and(
  //           eq(trip.isAvailable, true),
  //           or(
  //             // trip
  //             ilike(trip.titleEn, searchTerm),
  //             ilike(trip.titleRu, searchTerm),
  //             ilike(trip.descriptionEn, searchTerm),
  //             ilike(trip.descriptionRu, searchTerm),
  //             ilike(trip.longDescriptionEn, searchTerm),
  //             ilike(trip.longDescriptionRu, searchTerm),
  //             ilike(trip.pickupPointEn, searchTerm),
  //             ilike(trip.pickupPointRu, searchTerm),
  //             ilike(trip.placeOfReturnEn, searchTerm),
  //             ilike(trip.placeOfReturnRu, searchTerm),
  //             // destination
  //             ilike(destination.nameEn, searchTerm),
  //             ilike(destination.nameRu, searchTerm),
  //             // country
  //             ilike(country.nameEn, searchTerm),
  //             ilike(country.nameRu, searchTerm)
  //           )
  //         )
  //       )
  //       .limit(10);

  //     return results.map(result => ({
  //       ...result,
  //       type: 'trip' as const
  //     }));
  //   }),
});
