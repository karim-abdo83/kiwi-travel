import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { trip, destination, country } from "@/server/db/schema";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";

type SearchResult = {
  id: number;
  slug: string;
  titleEn: string | null;
  titleRu: string | null;
  titleTr: string | null;
  type: 'trip';
  destination: {
    nameEn: string | null;
    nameRu: string | null;
    nameTr: string | null;
  };
  country: {
    nameEn: string | null;
    nameRu: string | null;
    nameTr: string | null;
  };
};

type SearchExtendedResult = {
  id: number;
  type: 'trip' | 'destination';
  slug: string;
  nameEn?: string | null;
  nameRu?: string | null;
  nameTr?: string | null;
  titleEn?: string | null;
  titleRu?: string | null;
  titleTr?: string | null;
  destinationNameEn?: string | null;
  destinationNameRu?: string | null;
  destinationNameTr?: string | null;
  countryNameEn?: string | null;
  countryNameRu?: string | null;
  countryNameTr?: string | null;
  score: number;
  iconKey: string;
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
          titleTr: trip.titleTr,
          destination: {
            nameEn: destination.nameEn,
            nameRu: destination.nameRu,
            nameTr: destination.nameTr,
          },
          country: {
            nameEn: country.nameEn,
            nameRu: country.nameRu,
            nameTr: country.nameTr,
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
              ilike(trip.titleTr, searchTerm),
              ilike(destination.nameEn, searchTerm),
              ilike(destination.nameRu, searchTerm),
              ilike(destination.nameTr, searchTerm),
              ilike(country.nameEn, searchTerm),
              ilike(country.nameRu, searchTerm),
              ilike(country.nameTr, searchTerm)
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
    .query(async ({ ctx, input }): Promise<SearchExtendedResult[]> => {
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
          nameTr: destination.nameTr,  // Add Turkish name
          countryNameEn: country.nameEn,
          countryNameRu: country.nameRu,
          countryNameTr: country.nameTr,  // Add Turkish country name
          score: sql<number>`CASE 
            WHEN lower(${destination.nameEn}) = lower(${q}) THEN 4
            WHEN lower(${destination.nameTr}) = lower(${q}) THEN 4
            WHEN ${ilike(destination.nameEn, searchTerm)} OR ${ilike(destination.nameRu, searchTerm)} OR ${ilike(destination.nameTr, searchTerm)} THEN 2
            WHEN ${ilike(country.nameEn, searchTerm)} OR ${ilike(country.nameRu, searchTerm)} OR ${ilike(country.nameTr, searchTerm)} THEN 1
            ELSE 0 END`,
        })
        .from(destination)
        .innerJoin(country, eq(destination.countryId, country.id))
        .where(
          or(
            ilike(destination.nameEn, searchTerm),
            ilike(destination.nameRu, searchTerm),
            ilike(destination.nameTr, searchTerm),  // Add Turkish search
            ilike(country.nameEn, searchTerm),
            ilike(country.nameRu, searchTerm),
            ilike(country.nameTr, searchTerm)  // Add Turkish search
          )
        )
        .limit(10);
  
      const destinationResults = destinations.map((d) => ({
        id: d.id,
        type: "destination" as const,
        slug: d.slug,
        nameEn: d.nameEn,
        nameRu: d.nameRu,
        nameTr: d.nameTr,  // Add Turkish name
        countryNameEn: d.countryNameEn,
        countryNameRu: d.countryNameRu,
        countryNameTr: d.countryNameTr,  // Add Turkish country name
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
          titleTr: trip.titleTr,  // Add Turkish title
          destinationNameEn: destination.nameEn,
          destinationNameRu: destination.nameRu,
          destinationNameTr: destination.nameTr,  // Add Turkish destination name
          countryNameEn: country.nameEn,
          countryNameRu: country.nameRu,
          countryNameTr: country.nameTr,  // Add Turkish country name
          score: sql<number>`CASE
            WHEN lower(${trip.titleEn}) = lower(${q}) THEN 3
            WHEN lower(${trip.titleTr}) = lower(${q}) THEN 3
            WHEN ${ilike(trip.titleEn, searchTerm)} OR ${ilike(trip.titleRu, searchTerm)} OR ${ilike(trip.titleTr, searchTerm)} THEN 2
            WHEN ${ilike(trip.descriptionEn, searchTerm)} OR ${ilike(trip.descriptionRu, searchTerm)} OR ${ilike(trip.descriptionTr, searchTerm)} THEN 1
            WHEN ${ilike(destination.nameEn, searchTerm)} OR ${ilike(destination.nameRu, searchTerm)} OR ${ilike(destination.nameTr, searchTerm)} THEN 1
            WHEN ${ilike(country.nameEn, searchTerm)} OR ${ilike(country.nameRu, searchTerm)} OR ${ilike(country.nameTr, searchTerm)} THEN 1
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
              ilike(trip.titleTr, searchTerm),  // Add Turkish search
              ilike(trip.descriptionEn, searchTerm),
              ilike(trip.descriptionRu, searchTerm),
              ilike(trip.descriptionTr, searchTerm),  // Add Turkish search
              ilike(destination.nameEn, searchTerm),
              ilike(destination.nameRu, searchTerm),
              ilike(destination.nameTr, searchTerm),  // Add Turkish search
              ilike(country.nameEn, searchTerm),
              ilike(country.nameRu, searchTerm),
              ilike(country.nameTr, searchTerm)  // Add Turkish search
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
        titleTr: t.titleTr,  // Add Turkish title
        destinationNameEn: t.destinationNameEn,
        destinationNameRu: t.destinationNameRu,
        destinationNameTr: t.destinationNameTr,  // Add Turkish destination name
        countryNameEn: t.countryNameEn,
        countryNameRu: t.countryNameRu,
        countryNameTr: t.countryNameTr,  // Add Turkish country name
        score: t.score,
        iconKey: "trip",
      }));
  
      // Merge + rank by score
      const combined = [...destinationResults, ...tripResults].sort(
        (a, b) => b.score - a.score
      );
  
      return combined.slice(0, 20) as SearchExtendedResult[];
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
