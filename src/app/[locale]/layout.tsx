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
import { env } from "@/env";
import {
  firstDataLayerScript,
  googleTagManagerScript,
  secondDataLayerScript,
  yandexCounterScript,
} from "./scripts";

export const metadata: Metadata = {
  title: "Karim Tour",
  description: "Awesome website for booking your next travel",
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL || "https://karimtor.com"),
  icons: {
    icon: "/logo-icon.svg",
    apple: "/logo-icon.svg",
    shortcut: "/logo-icon.svg",
  },
  openGraph: {
    title: "Karim Tour",
    description: "Awesome website for booking your next travel",
    url: "/",
    siteName: "Karim Tour",
    images: [
      {
        url: "/logo-icon.svg",
        width: 343,
        height: 350,
        alt: "Karim Tour",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karim Tour",
    description: "Awesome website for booking your next travel",
    images: ["/logo-icon.svg"],
  },
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
        {/* ✅ Preload primary hero images to improve LCP */}
        <link rel="preload" as="image" href="/hero1.jpg" />
        <link rel="preload" as="image" href="/mobile1.jpg" />

        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-17215052073" strategy="lazyOnload" />
        <Script
          src={googleTagManagerScript}
          strategy="lazyOnload"
        />
        <Script id="gtm-data-layer" strategy="lazyOnload">
          {firstDataLayerScript}
        </Script>
        <Script id="gtm-data-layer-2" strategy="lazyOnload">
          {secondDataLayerScript}
        </Script>
        <Script id="yandex-metrica" strategy="lazyOnload">
          {yandexCounterScript}
        </Script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/102714145"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Karim Tour",
              url: env.NEXT_PUBLIC_APP_URL || "https://karimtor.com",
              logo: "/logo.png",
              sameAs: [
                "https://www.instagram.com/kiwitraveleg?igsh=MXJzZjFwY2Fzc2E2Zw==",
                "https://www.facebook.com/share/16NjtcXwqN/?mibextid=wwXIfr",
                "https://vk.com/kiwitravelseg",
                "https://t.me/karimkiwi",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Karim Tour",
              url: env.NEXT_PUBLIC_APP_URL || "https://karimtor.com",
              potentialAction: {
                "@type": "SearchAction",
                target: `${env.NEXT_PUBLIC_APP_URL || "https://karimtor.com"}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
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

