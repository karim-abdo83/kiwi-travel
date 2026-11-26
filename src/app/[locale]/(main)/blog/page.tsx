import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { BLOG_ARTICLE_SLUGS } from "@/lib/blog";
import { type AppLocale, buildAlternates } from "@/lib/seo/alternates";

const translatedLocales: AppLocale[] = ["en", "ru", "tr"];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Blog");
  const locale = await getLocale();

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates("/blog", locale, translatedLocales),
    ...(locale === "de" ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function BlogListPage() {
  const t = await getTranslations("Blog");
  const locale = await getLocale();

  const articleSlugs = BLOG_ARTICLE_SLUGS;

  return (
    <main className="container mx-auto mt-16 max-w-6xl px-4 py-12 md:mt-24">
      <div className="mb-16 max-w-4xl">
        <h1 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white md:text-6xl">
          {t("title")}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articleSlugs.map((slug) => (
          <Link key={slug} href={`/blog/${slug}`} className="group h-full">
            <Card className="flex h-full flex-col overflow-hidden border-primary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <CardHeader className="p-0">
                <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 transition-colors group-hover:from-primary/30">
                  <Image
                    src="/logo.svg"
                    alt="Karim Tour"
                    width={140}
                    height={140}
                    className="opacity-70 transition-opacity group-hover:opacity-100"
                  />
                </div>
              </CardHeader>

              <CardContent className="flex flex-grow flex-col p-6">
                <h2 className="mb-3 line-clamp-2 text-2xl font-bold transition-colors group-hover:text-primary">
                  {t(`${slug}.title`)}
                </h2>

                <p className="mb-6 line-clamp-3 flex-grow text-gray-600 dark:text-gray-400">
                  {t(`${slug}.intro`)}
                </p>

                <div className="mt-auto flex items-center text-sm font-bold text-primary">
                  {t(`${slug}.readMore`)}
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
