import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { tripRouter } from "./routers/trip";
import { destinationRouter } from "./routers/destination";
import { tripFeatureRouter } from "./routers/trip-feature";
import { countryRouter } from "./routers/country";
import { faqRouter } from "./routers/faq";
import { tripBookingRouter } from "./routers/trip-booking";
import { reviewRouter } from "./routers/review";
import { notificationsRouter } from "./routers/notifications";
import { tripTypeRouter } from "./routers/trip-type";
import { tripSearchRouter } from "./routers/trip-search";
import { appContentRouter } from "./routers/app-content";
import { contactClickRouter } from "./routers/contact-click";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  trip: tripRouter,
  destination: destinationRouter,
  tripFeature: tripFeatureRouter,
  country: countryRouter,
  faq: faqRouter,
  tripBooking: tripBookingRouter,
  review: reviewRouter,
  notifications: notificationsRouter,
  tripType: tripTypeRouter,
  search: tripSearchRouter,
  appContent: appContentRouter,
  contactClick: contactClickRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
