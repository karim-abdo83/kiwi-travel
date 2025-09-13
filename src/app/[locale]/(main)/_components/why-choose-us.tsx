import { Shield, ThumbsUp, Headphones } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WhyChooseUs() {
  const t = useTranslations("HomePage.whyChooseUs");

  const reasons = [
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: t("reason1Title"),
      description: t("reason1Description"),
    },
    {
      icon: <ThumbsUp className="h-12 w-12 text-primary" />,
      title: t("reason2Title"),
      description: t("reason2Description"),
    },
    {
      icon: <Headphones className="h-12 w-12 text-primary" />,
      title: t("reason3Title"),
      description: t("reason3Description"),
    },
  ]

  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl lg:text-3xl md:text-3xl font-bold mb-8 text-center">{t("sectionTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{reason.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

