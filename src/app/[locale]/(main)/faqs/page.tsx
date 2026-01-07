import type { Metadata } from "next";
import type { WithContext, FAQPage as FAQPageSchema } from "schema-dts";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getLocale, getTranslations } from "next-intl/server";
import { localeAttributeFactory } from "@/lib/utils";
import { api } from "@/trpc/server";
import { env } from "@/env";
import { routing } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FAQsPage");
  const locale = await getLocale();

  const baseUrl = (env.NEXT_PUBLIC_APP_URL || "https://karimtor.com").replace(/\/$/, "");
  const url = `${baseUrl}/${locale}/faqs`;

  const title = `${t("title")} | Karim Tour`;
  const description = t("description");

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          `${baseUrl}/${l}/faqs`,
        ])
      ),
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}


export default async function FAQPage() {
  const t = await getTranslations("FAQsPage");

  const locale = await getLocale();
  const localeAttribute = localeAttributeFactory(locale);

  // FAQs 100% dinámicas desde el panel
  const faqs = await api.faq.list();

  // Schema FAQ dinámico
  const faqSchema: WithContext<FAQPageSchema> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: localeAttribute(faq, "question"),
      acceptedAnswer: {
        "@type": "Answer",
        text: localeAttribute(faq, "answer"),
      },
    })),
  };

  return (
    <>
      {/* Schema FAQ */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <main className="container mx-auto mt-20 px-4 py-8 lg:px-0">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t("description")}
          </p>
        </div>

       
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                <AccordionTrigger className="text-left">
                  {localeAttribute(faq, "question")}
                </AccordionTrigger>
                <AccordionContent>
                  {localeAttribute(faq, "answer")}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        
      </main>
    </>
  );
}
