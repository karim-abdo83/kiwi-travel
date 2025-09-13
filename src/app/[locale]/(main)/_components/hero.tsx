"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from "next-intl";
import SearchCard from "./search-card";
import styles from "./Hero.module.css";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useBackgroundSlideshow } from "@/hooks/useBackgroundSlideshow";

const BACKGROUND_IMAGES = [
  '/hero.jpg',
  '/hero2.jpg', 
  '/hero3.jpg' 
];

export default function Hero() {
  const t = useTranslations("HomePage.hero");
  const { currentImage } = useBackgroundSlideshow(BACKGROUND_IMAGES, 5000);
  
  const headline = t("headline") || ''; 
  const headlineParts = headline.split(' ');
  const lastWord = headlineParts.slice(-1)[0] || '';
  const restOfText = headlineParts.slice(0, -1).join(' ');
  
  const displayText = useTypewriter(restOfText, 50);
  const [showLastWord, setShowLastWord] = useState(false);
  const lastWordDisplay = useTypewriter(lastWord, 50);
  
  useEffect(() => {
    if (displayText === restOfText) {
      setShowLastWord(true);
    }
  }, [displayText, restOfText]);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {BACKGROUND_IMAGES.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-1000 ${
              currentImage === image ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${image}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>
          </div>
        ))}
      </div>

      <div className="container relative mx-auto h-full flex flex-col items-center justify-center text-center px-4">
        <div className={`max-w-4xl space-y-6 ${styles.animateFadeInUp}`}>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight min-h-[1.2em]">
            <span className="bg-clip-text">
              {displayText}
              {showLastWord && ` ${lastWordDisplay}`}
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed">
            {t("subheadline")}
          </p>
          <div className="mt-8 transform transition-all duration-500 hover:scale-105">
            <SearchCard />
          </div>
        </div>
      </div>
    </section>
  );
}
