import { getLocale, getTranslations } from "next-intl/server";
import { PageParams } from "@/types/page-params";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isBlogArticleSlug } from "@/lib/blog";
import { type AppLocale, buildAlternates } from "@/lib/seo/alternates";

const translatedLocales: AppLocale[] = ["en", "ru", "tr"];

const internalLinks: Record<string, string> = {
  article1: "/destinations/sharm-el-sheikh-day-tours",
  article2: "/ru",
  article3: "/trips/transfer-from-to-airport-sharm-elsheikh",
};

/** Plain-text meta description from a rich-text intro: strips tags, cuts at a word boundary. */
function toMetaDescription(raw: string, max = 160) {
  const text = raw
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:—–-]+$/, "")}…`;
}

export async function generateMetadata({
  params,
}: PageParams<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  if (!isBlogArticleSlug(slug)) notFound();

  const t = await getTranslations("Blog");
  const locale = await getLocale();

  return {
    title: t(`${slug}.title`),
    description: toMetaDescription(t.raw(`${slug}.intro`) as string),
    alternates: buildAlternates(`/blog/${slug}`, locale, translatedLocales),
    ...(locale === "de" ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function BlogPage({
  params,
}: PageParams<{ slug: string }>) {
  const { slug } = await params;
  if (!isBlogArticleSlug(slug)) notFound();

  const t = await getTranslations("Blog");

  const articleLink = internalLinks[slug] || "/destinations";

  const sections = t.raw(`${slug}.sections`) as Array<{
    title: string;
    text?: string;
    link?: string;
    type?: string;
  }>;

  const richTextElements = {
    cairoLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/cairo-day-tours"
        className="font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    gizaLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/cairo-day-tours"
        className="font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    luxorLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/luxor-day-tours"
        className="font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    hurghadaLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/hurghada-day-tours"
        className="font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    sharmLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/sharm-el-sheikh-day-tours"
        className="font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
    marsaLink: (chunks: React.ReactNode) => (
      <Link
        href="/destinations/marsa-alam-day-tours"
        className="font-semibold text-primary hover:underline"
      >
        {chunks}
      </Link>
    ),
  };

  return (
    <main className="container mx-auto mt-12 max-w-4xl px-4 py-8 md:mt-20">
      {/* Back */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Home
      </Link>

      <article className="prose mx-auto dark:prose-invert lg:prose-xl">
        {/* TITLE */}
        <h1 className="mb-6 text-4xl font-extrabold text-gray-900 dark:text-white md:text-5xl">
          {t(`${slug}.title`)}
        </h1>

        {/* INTRO - Con soporte para Texto Enriquecido */}
        <p className="mb-10 border-l-4 border-primary pl-4 text-xl italic leading-relaxed text-gray-600 dark:text-gray-300">
          {t.rich(`${slug}.intro`, richTextElements)}
        </p>

        <div className="space-y-12">
          {sections?.map((section, idx) => {
            if (section.type === "intro_block") {
              return (
                <h2
                  key={idx}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  {section.title}
                </h2>
              );
            }

            return (
              <section key={idx} className="space-y-3">
                {section.link ? (
                  <Link
                    href={section.link}
                    className="inline-flex items-center text-2xl font-bold text-gray-900 transition-colors hover:text-primary dark:text-white"
                  >
                    {section.title}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                )}

                {/* TEXT - Renderizado utilizando t.rich con apuntado de ruta dinámica de i18n */}
                {section.text && (
                  <p className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-400">
                    {t.rich(`${slug}.sections.${idx}.text`, richTextElements)}
                  </p>
                )}
              </section>
            );
          })}
        </div>

        {/* CTA GLOBAL */}
        <div className="my-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-gray-50 to-gray-100 p-8 shadow-lg dark:from-gray-900 dark:to-gray-800">
          <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            {t("cta.title")}
          </h3>

          <p className="mb-6 text-gray-600 dark:text-gray-400">
            {t("cta.description")}
          </p>

          <Button size="lg" className="w-full font-bold md:w-auto" asChild>
            <Link href="/destinations">{t("cta.button")}</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
