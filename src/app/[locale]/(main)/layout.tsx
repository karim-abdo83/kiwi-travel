import { routing } from "@/i18n/routing";
import Header from "./_components/header";
import Footer from "./_components/footer";
import ReviewFeedback from "./_components/review-feedback";
import ConfirmFeedback from "./_components/confirm-feedback";
import ContactsSidebar from "./_components/contacts-sidebar";
import { PageParams } from "@/types/page-params";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { env } from "@/env";
import { auth } from "@clerk/nextjs/server";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageParams<{ locale: string }>): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL || "https://karimtor.com"),
    title: {
      default: t("title"),
      template: "%s | Karim Tour",
    },
    description: t("description"),
    keywords: t("keywords"),
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      title: "Karim Tour",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}



export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  return (
    <>
      <Header />
      {children}
      <Footer />
      {
        userId !== null && (
          <>
            <ReviewFeedback />
            <ConfirmFeedback />
          </>
        )
      }
      <ContactsSidebar />
    </>
  );
}
