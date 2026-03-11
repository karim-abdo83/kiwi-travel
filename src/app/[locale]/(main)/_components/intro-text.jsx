"use client";
import { useTranslations } from "next-intl";

export default function IntroText() {
  const t = useTranslations("HomePage.intro");

  return (
    <section className="py-12 sm:pt-16 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 mt-6 text-foreground tracking-tight">
          {t("title")}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          {t("description")}
        </p>
      </div>
    </section>
  );
}