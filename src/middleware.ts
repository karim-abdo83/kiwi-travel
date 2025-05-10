import createIntlMiddleware from "next-intl/middleware";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { ipAddress } from "@vercel/functions";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(10, "3s"),
  prefix: "@upstash/ratelimit",
})

const isAdminRoute = createRouteMatcher([
  "/en/dashboard(.*)",
  "/ru/dashboard(.*)",
])

const isAPIRoute = createRouteMatcher([
  "/api(.*)",
])

const isBookingsRoute = createRouteMatcher([
  "/en/bookings(.*)",
  "/ru/bookings(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();
  
  if (isAdminRoute(req) && !sessionClaims?.metadata?.isAdmin) {
    await auth.protect();
  }

  if (isBookingsRoute(req)) {
    await auth.protect();
  }

  // prevent locale handling for api endpoints
  if (isAPIRoute(req)) return;

  const ip = ipAddress(req) ?? "127.0.0.1";

  const { success } = await ratelimit.limit(ip);

  if (!success) return new NextResponse("You have reached the limit of requests, please reduce your requests speed :).")

  return createIntlMiddleware(routing)(req);
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // for internationalized pathnames
    "/",
    "/(en|ru)/:path*",
  ],
};
