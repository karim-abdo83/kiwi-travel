import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PrivacyPolicyPage");

  return {
    title: `${t("title")} | Karim Tour`,
    description: t("description"),
      robots: {
      index: false,
      follow: false,
    }
  };
}

const privacyData = Array(6)
  .fill(null)
  .map((_, index) => ({
    title: `section${index + 1}Title`,
    content: `section${index + 1}Content`,
  }));

export default async function PrivacyPage() {
  const t = await getTranslations("PrivacyPolicyPage");

  return (
    <main className="container mx-auto mt-20 px-4 py-8 lg:grid lg:px-0">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-4 text-muted-foreground">{t("description")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("lastUpdated")}</p>
      </div>

      <div className="prose max-w-none">
        {privacyData.map((section) => (
          <section key={section.title} className="mb-8 text-foreground">
            <h2 className="mb-4 text-2xl text-foreground font-semibold">{t(section.title)}</h2>
            <p>{t(section.content)}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
