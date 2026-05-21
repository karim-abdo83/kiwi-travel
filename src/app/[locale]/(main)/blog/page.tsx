import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";

export default async function BlogListPage() {
  const t = await getTranslations("Blog");
  const locale = await getLocale();
  
  const articleSlugs = ["sahl-hasheesh-excursions", "el-gouna-excursions-guide", "sharm-airport-transfer", "top-places-to-visit-egypt"];

  return (
    <main className="container mx-auto md:mt-24 mt-16 px-4 py-12 max-w-6xl">
      <div className="max-w-4xl mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-gray-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articleSlugs.map((slug) => (
          <Link key={slug} href={`/blog/${slug}`} className="group h-full">
            <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-primary/10 overflow-hidden">
              <CardHeader className="p-0">
               <div className="h-48 w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 transition-colors">
                    <Image
                        src="/logo.svg"
                        alt="Karim Tour"
                        width={140}
                        height={140}
                        className="opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                    </div>
              </CardHeader>
              
              <CardContent className="p-6 flex flex-col flex-grow">
                
                
                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {t(`${slug}.title`)}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-grow">
                  {t(`${slug}.intro`)}
                </p>
                
                <div className="flex items-center text-primary font-bold text-sm mt-auto">
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