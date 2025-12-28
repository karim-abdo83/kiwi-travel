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
  "/tr/dashboard(.*)",
])

const isAPIRoute = createRouteMatcher([
  "/api(.*)",
])

const isSeoStaticRoute = createRouteMatcher([
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/manifest.webmanifest",
]);

const isBookingsRoute = createRouteMatcher([
  "/en/bookings(.*)",
  "/ru/bookings(.*)",
  "/tr/bookings(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();
  const { pathname } = req.nextUrl;
  
  if (isAdminRoute(req) && !sessionClaims?.metadata.isAdmin) {
    await auth.protect();
  }

  if (isBookingsRoute(req)) {
    await auth.protect();
  }

  // prevent locale handling for api endpoints
  if (isAPIRoute(req)) return;

  // bypass i18n for SEO/static root files
  if (isSeoStaticRoute(req)) return NextResponse.next();

  // REDIRECT 301 for url without locate
    const hasLocale = routing.locales.some(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
    );

    if (!hasLocale) {
      const url = req.nextUrl.clone();
      url.pathname = `/${routing.defaultLocale}${pathname}`;
      return NextResponse.redirect(url, 301); 
    }


  const ip = ipAddress(req) ?? "127.0.0.1";

  const { success } = await ratelimit.limit(ip);

  if (!success) return new NextResponse("You have reached the limit of requests, please reduce your requests speed :).")

  return createIntlMiddleware(routing)(req);
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // for internationalized pathnames
    "/",
    "/(en|ru|tr)/:path*",
  ],
};
