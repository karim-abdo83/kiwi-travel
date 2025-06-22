import { TRIP_SEARCH_PAGE_SIZE } from "@/constants";
import { mainImage } from "@/lib/utils";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import {
  country,
  destination,
  trip,
  tripToFeature,
  tripToTripType
} from "@/server/db/schema";
import {
  days,
  tripFormSchema,
  tripSearchFormSchema,
} from "@/validators/trip-schema";
import {
  and,
  countDistinct,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  or,
  sql
} from "drizzle-orm";
import { z } from "zod";

export const tripRouter = createTRPCRouter({
  adminList: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.trip.findMany({
      with: {
        destination: {
          with: {
            country: true,
          },
          columns: {
            nameEn: true,
          },
        },
      },
      columns: {
        id: true,
        assetsUrls: true,
        titleEn: true,
        adultTripPriceInCents: true,
        isAvailable: true,
        isFeatured: true,
        isConfirmationRequired: true,
      },
    });
  }),
  adminView: adminProcedure.input(z.number().int()).query(
    async ({ ctx, input }) =>
      await ctx.db.query.trip.findFirst({
        where: ({ id }, { eq }) => eq(id, input),
        with: {
          destination: true,
          features: true,
          tripTypes: true,
        },
      }),
  ),
  adminViewDetailsPage: adminProcedure.input(z.number().int()).query(
    async ({ ctx, input }) =>
      await ctx.db.query.trip.findFirst({
        where: ({ id }, { eq }) => eq(id, input),
        columns: {
          id: true,
          titleEn: true,
          titleRu: true,
          adultTripPriceInCents: true,
          childTripPriceInCents: true,
          childAge: true,
          infantAge: true,
          assetsUrls: true,
          descriptionEn: true,
          descriptionRu: true,
          isFeatured: true,
          isConfirmationRequired: true,
        },
        with: {
          destination: {
            columns: {
              id: true,
              nameEn: true,
              nameRu: true,
            },
            with: {
              country: true,
            },
          },
          reviews: true,
        },
      }),
  ),
  adminCreate: adminProcedure
    .input(tripFormSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.transaction(async (tx) => {
        const result = await tx
          .insert(trip)
          .values({
            ...input,
            assetsUrls: input.assets,
            adultTripPriceInCents: Math.floor(input.adultPrice * 100),
            childTripPriceInCents: Math.floor(input.childPrice * 100),
          })
          .returning({ id: trip.id });

        const tripId = result[0]!.id;

        await tx.insert(tripToFeature).values(
          input.features.map((featureId) => ({
            tripId,
            featureId,
          })),
        );

        await tx.insert(tripToTripType).values(
          input.tripTypes.map(tripTypeId => ({
            tripId,
            tripTypeId,
          }))
        );
      });

      return {
        message: "Created successfully",
      };
    }),
  adminUpdate: adminProcedure
    .input(tripFormSchema.extend({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(trip)
          .set({
            ...input,
            assetsUrls: input.assets,
            adultTripPriceInCents: Math.floor(input.adultPrice * 100),
            childTripPriceInCents: Math.floor(input.childPrice * 100),
          })
          .where(eq(trip.id, input.id));

        await tx
          .delete(tripToFeature)
          .where(eq(tripToFeature.tripId, input.id));

        await tx
          .delete(tripToTripType)
          .where(eq(tripToTripType.tripId, input.id));

        await tx.insert(tripToFeature).values(
          input.features.map((featureId) => ({
            tripId: input.id,
            featureId,
          })),
        );

        await tx.insert(tripToTripType).values(
          input.tripTypes.map(tripTypeId => ({
            tripId: input.id,
            tripTypeId,
          }))
        );
      });

      return {
        message: "Updated successfully",
      };
    }),
  adminDelete: adminProcedure
    .input(z.number().int())
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(trip).where(eq(trip.id, input));

      return {
        message: "Deleted successfully",
      };
    }),
  listSearch: publicProcedure
    .input(tripSearchFormSchema)
    .query(async ({ ctx, input }) => {
      console.log("Input\n", input)

      // ========= query conditions =========
      const dateCondition =
        input.date &&
        sql`${days[input.date.getDay()]} = ANY(${trip.availableDays})`;

      const typeCondition =
        input.types && input.types.length !== 0
          ? inArray(tripToTripType.tripTypeId, input.types)
          : undefined;

      const priceLowerCondition =
        input.price?.lower !== undefined
          ? gte(trip.adultTripPriceInCents, input.price.lower * 100)
          : undefined;

      const priceGreaterCondition =
        input.price?.greater !== undefined
          ? lte(trip.adultTripPriceInCents, input.price.greater * 100)
          : undefined;

      const destinationsCondition =
        input.destinations && input.destinations.length !== 0
          ? inArray(destination.id, input.destinations)
          : undefined;

      const countriesCondition =
        input.countries && input.countries.length !== 0
          ? inArray(country.id, input.countries)
          : undefined;

      const searchCondition =
        input.search !== undefined && input.search.length !== 0
          ? or(
              ilike(trip.titleEn, `%${input.search}%`),
              ilike(trip.titleRu, `%${input.search}%`),
              ilike(destination.nameEn, `%${input.search}%`),
              ilike(destination.nameRu, `%${input.search}%`),
              ilike(country.nameEn, `%${input.search}%`),
              ilike(country.nameRu, `%${input.search}%`),
            )
          : undefined;

      const conditions = and(
        eq(trip.isAvailable, true),
        dateCondition,
        typeCondition,
        priceLowerCondition,
        priceGreaterCondition,
        destinationsCondition,
        countriesCondition,
        searchCondition,
      );

      // ========= pagination control ==========
      const pageIndex = input.page ?? 0;

      const totalCountResult = await ctx.db
        .selectDistinct({ count: countDistinct(trip.id) })
        .from(trip)
        .innerJoin(destination, eq(trip.destinationId, destination.id))
        .innerJoin(country, eq(destination.countryId, country.id))
        .leftJoin(tripToTripType, eq(trip.id, tripToTripType.tripId))
        .where(conditions);

      const _reviews = await ctx.db.query.review.findMany({
        where: (fields, { eq, and }) => and(eq(fields.isHiddenByAdmin, false)),
        columns: {
          tripId: true,
          ratingValue: true,
        },
      });

      const calculateReviewsValueAndCount = (tripId: number) => {
        const arr = _reviews.filter((r) => r.tripId === tripId);

        const res = arr.reduce((acc, curr) => acc + curr.ratingValue, 0) / arr.length;

        return isNaN(res) ? {
          reviewsValue: 0,
          reviewsCount: 0,
        } : {
          reviewsValue: arr.reduce((acc, curr) => acc + curr.ratingValue, 0) / arr.length,
          reviewsCount: arr.length,
        };
      };

      return await ctx.db
        .selectDistinct({
          id: trip.id,
          titleEn: trip.titleEn,
          titleRu: trip.titleRu,
          assets: trip.assetsUrls,
          priceInCents: trip.adultTripPriceInCents,
          duration: trip.duration,
          isFeatured: trip.isFeatured,
          countryEn: country.nameEn,
          countryRu: country.nameRu,
          destinationEn: destination.nameEn,
          destinationRu: destination.nameRu,
          destinationId: destination.id,
        })
        .from(trip)
        .innerJoin(destination, eq(trip.destinationId, destination.id))
        .innerJoin(country, eq(destination.countryId, country.id))
        .leftJoin(tripToTripType, eq(trip.id, tripToTripType.tripId))
        .where(conditions)
        .orderBy(trip.isFeatured)
        .limit(TRIP_SEARCH_PAGE_SIZE)
        .offset(pageIndex * TRIP_SEARCH_PAGE_SIZE)
        .then((result) => ({
          totalCount: totalCountResult[0]?.count ?? 0,
          items: result.map((item) => {
            const { reviewsCount, reviewsValue } = calculateReviewsValueAndCount(item.id);

            return {
              id: item.id,
              titleEn: item.titleEn,
              titleRu: item.titleRu,
              destinationId: item.destinationId,
              locationEn: `${item.countryEn}, ${item.destinationEn}`,
              locationRu: `${item.countryRu}, ${item.destinationRu}`,
              price: Math.floor(item.priceInCents / 100),
              duration: item.duration,
              isFeatured: item.isFeatured,
              image: mainImage(item.assets),
              reviewsValue,
              reviewsCount,
            }
          }),
        }));
    }),
  listFeatured: publicProcedure.query(
    async ({ ctx }) =>
      await ctx.db.query.trip
        .findMany({
          where: ({ isFeatured }, { eq }) => eq(isFeatured, true),
          columns: {
            id: true,
            titleEn: true,
            titleRu: true,
            adultTripPriceInCents: true,
            assetsUrls: true,
          },
          with: {
            reviews: {
              where: ({ isHiddenByAdmin }, { eq }) => eq(isHiddenByAdmin, false),
              columns: {
                ratingValue: true,
              },
            },
          },
        })
        .then((res) =>
          res.map((item) => {
            const _reviewsValue = item.reviews.reduce((acc, curr) => acc + curr.ratingValue, 0) / item.reviews.length;

            return {
              id: item.id,
              titleEn: item.titleEn,
              titleRu: item.titleRu,
              price: Math.floor(item.adultTripPriceInCents / 100),
              image: mainImage(item.assetsUrls),
              reviewsValue: isNaN(_reviewsValue) ? 0 : _reviewsValue,
            }
          }),
        ),
  ),
  listByDestination: publicProcedure.input(z.number().int()).query(
    async ({ ctx, input }) =>
      await ctx.db.query.destination.findFirst({
        where: ({ id }, { eq }) => eq(id, input),
        with: {
          trips: {
            columns: {
              id: true,
              titleEn: true,
              titleRu: true,
              descriptionEn: true,
              descriptionRu: true,
              duration: true,
              adultTripPriceInCents: true,
              assetsUrls: true,
            },
          },
        },
      }),
  ),
  listStaticParams: publicProcedure.query(async ({ ctx }) => ctx.db.query.trip.findMany({
    where: ({ isAvailable }, { eq }) => eq(isAvailable, true),
    columns: {
      id: true,
      updatedAt: true,
    },
  })),
  view: publicProcedure.input(z.number().int()).query(
    async ({ ctx, input }) =>
      await ctx.db.query.trip.findFirst({
        where: ({ id }, { eq }) => eq(id, input),
        with: {
          tripTypes: {
            with: {
              tripType: true,
            },
          },
          destination: {
            with: {
              country: true,
            },
          },
          features: {
            with: {
              feature: true,
            },
          },
          reviews: {
            where: ({ isHiddenByAdmin }, { eq }) => eq(isHiddenByAdmin, false),
          },
        },
      }),
  ),
});
