"use client";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqSection() {
  const t = useTranslations("HomePage.faq");

  const faqs = ["q1", "q2", "q3", "q4"];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((key) => ({
      "@type": "Question",
      "name": t(key),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": t(key.replace("q", "a")),
      },
    })),
  };

  return (
    <section className="py-16 sm:py-24 bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 tracking-tight">
          {t("title")}
        </h2>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((key, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                {t(key)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {t(key.replace("q", "a"))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}