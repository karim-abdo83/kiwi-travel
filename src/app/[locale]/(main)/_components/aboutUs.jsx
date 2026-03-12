"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";


export default function AboutUs() {
  const t = useTranslations("HomePage.aboutUs");

  return (
<section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-fixed" style={{
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/feature-trip.jpg)'
    }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div >
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center">
              {t("title")}
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-white leading-relaxed italic border-l-4 border-primary">
                {t("description1")}
              </p>
              <p className="text-lg text-white leading-relaxed">
                {t("description2")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}