import "@/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { PageParams } from "@/types/page-params";
import { Toaster } from "@/components/ui/toaster";
import Providers from "./providers";
import Script from "next/script";
import { firstDataLayerScript, googleTagManagerScript, secondDataLayerScript, yandexCounterScript } from "./scripts";

export const metadata: Metadata = {
  title: "Karim Tour",
  description: "Awesome website for booking your next travel",
};

async function UTSSR() {
  await connection();
  return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />;
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode } & PageParams<{ locale: string }>>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-17215052073" />
        <Script>{firstDataLayerScript}</Script>

        <Script>{googleTagManagerScript}</Script>

        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-J2HS403HD2" />
        <Script>{secondDataLayerScript}</Script>

        <Script>{yandexCounterScript}</Script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/102714145"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PTKXXBPK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <NextIntlClientProvider>
          <Providers locale={locale}>
            <Suspense>
              <UTSSR />
            </Suspense>
            {children}
            <Toaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
