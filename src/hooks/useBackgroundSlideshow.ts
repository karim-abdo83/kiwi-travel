import { useState, useEffect } from 'react';

export const useBackgroundSlideshow = (images: string[], interval: number = 5000) => {
  const [currentImage, setCurrentImage] = useState(images[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  useEffect(() => {
    setCurrentImage(images[currentIndex]);
  }, [currentIndex, images]);

  return { currentImage };
};

export default useBackgroundSlideshow;
