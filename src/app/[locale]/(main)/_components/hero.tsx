"use client";

import { useTranslations } from "next-intl";
import SearchCard from "./search-card";

export default function Hero() {
  const t = useTranslations("HomePage.hero");

  const headline = t("headline") || "";

  const backgroundStyle = {
    backgroundImage: `url(/mobile3.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundBlendMode: "overlay",
    backgroundAttachment: "scroll",
  } as const;

  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={backgroundStyle}
      >
      </div>

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 pt-20 pb-32">
        <div className="max-w-4xl space-y-6 mt-48">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
            {headline}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed">
            {t("subheadline")}
          </p>
        </div>
      </div>

      <div className="relative w-full mt-16">
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1/2 w-full max-w-4xl px-4 z-50">
          <div>
            <SearchCard />
          </div>
        </div>
      </div>
    </div>
  );
}
