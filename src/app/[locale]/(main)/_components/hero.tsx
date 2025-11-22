"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import SearchCard from "./search-card";
import styles from "./Hero.module.css";
import { useBackgroundSlideshow } from "@/hooks/useBackgroundSlideshow";

const useWindowWidth = () => {
  const [width, setWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined") {
      const handleResize = () => setWidth(window.innerWidth);

      handleResize();

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return isMounted ? width : 0;
};

// Desktop background images
const DESKTOP_IMAGES = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"];

// Mobile background images
const MOBILE_IMAGES = ["/mobile1.jpg", "/mobile2.jpg", "/mobile3.jpg"];

export default function Hero() {
  const t = useTranslations("HomePage.hero");
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const { currentImage: desktopImage } = useBackgroundSlideshow(DESKTOP_IMAGES, 5000);
  const { currentImage: mobileImage } = useBackgroundSlideshow(MOBILE_IMAGES, 5000);
  const currentImage = isMobile ? mobileImage : desktopImage;

  const headline = t("headline") || "";

  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error(`Failed to load image: ${currentImage}`);
    setImageError(true);
  };

  const backgroundStyle = imageError
    ? {
        backgroundColor: "rgba(0,0,0,0.7)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        backgroundImage: `url(${currentImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
        backgroundAttachment: windowWidth >= 768 ? "fixed" : "scroll",
      };

  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={backgroundStyle}
        onError={handleImageError}
      >
        {/* Preload all hero images */}
        <div className="hidden">
          {DESKTOP_IMAGES.map((img, index) => (
            <img
              key={`desktop-${index}`}
              src={img}
              alt=""
              onError={(e) => {
                console.error(`Failed to preload desktop image: ${img}`);
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ))}
          {MOBILE_IMAGES.map((img, index) => (
            <img
              key={`mobile-${index}`}
              src={img}
              alt=""
              onError={(e) => {
                console.error(`Failed to preload mobile image: ${img}`);
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ))}
        </div>
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
