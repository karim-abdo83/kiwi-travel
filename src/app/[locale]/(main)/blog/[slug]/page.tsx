import { getLocale, getTranslations } from "next-intl/server";
import { PageParams } from "@/types/page-params";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/routing";

const internalLinks: Record<string, string> = {
  article1: "/destinations/sharm-el-sheikh-day-tours",
  article2: "/ru",
  article3: "/trips/transfer-from-to-airport-sharm-elsheikh"
};

export default async function BlogPage({ params }: PageParams<{ slug: string }>) {
  const { slug } = await params;
  const t = await getTranslations("Blog");

  const articleLink = internalLinks[slug] || "/destinations";

  const sections = t.raw(`${slug}.sections`) as Array<{
    title: string;
    text?: string;
    link?: string;
    type?: string;
  }>;

  return (
    <main className="container mx-auto md:mt-20 mt-12 px-4 py-8 max-w-4xl">
      {/* Back */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Home
      </Link>

      <article className="prose lg:prose-xl mx-auto dark:prose-invert">
        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white">
          {t(`${slug}.title`)}
        </h1>

        {/* INTRO */}
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed italic border-l-4 border-primary pl-4">
          {t(`${slug}.intro`)}
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
                        className="inline-flex items-center text-2xl font-bold text-gray-900 dark:text-white hover:text-primary transition-colors"
                    >
                        {section.title}
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                    ) : (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {section.title}
                    </h2>
                    )}

                    {section.text && (
                    <p className="text-gray-700 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                        {section.text}
                    </p>
                    )}
                </section>
                );
          })}
        </div>

        {/* CTA GLOBAL */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 rounded-2xl border border-primary/20 shadow-lg my-12">
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            {t("cta.title")}
          </h3>

          <p className="mb-6 text-gray-600 dark:text-gray-400">
            {t("cta.description")}
          </p>

          <Button size="lg" className="w-full md:w-auto font-bold" asChild>
            <Link href="/destinations">{t("cta.button")}</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}