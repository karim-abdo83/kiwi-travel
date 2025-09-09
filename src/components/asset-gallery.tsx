"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// Import styles
import { PLACEHOLDER_IMAGE } from "@/constants";
import { Play } from "lucide-react";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
const LazyLightbox = dynamic(() =>
  import("@/components/lazy-light-box").then((mod) => mod.default),
);

interface AssetGalleryProps {
  assets: string[];
  title: string;
}

const isVideo = (url: string) => url.endsWith("?type=video");

export function AssetGallery({ assets, title }: AssetGalleryProps) {
  // State for lightbox
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // Format images for lightbox
  const lightboxImages = assets.map((asset) => {
    const isUrlVideo = isVideo(asset);

    return {
      src: isUrlVideo ? null : asset,
      type: isUrlVideo ? "video" : "image",
      sources: isUrlVideo
        ? [
            {
              src: asset,
            },
          ]
        : undefined,
    };
  });

  // Calculate how many thumbnails to show
  const MAX_TOTAL_IMAGES_WITHOUT_INDICATOR = 5; // 1 main + 4 thumbnails
  const MAX_VISIBLE_THUMBNAILS = 4;

  // Determine if we need to show the "+X" indicator
  const hasMoreImages = assets.length > MAX_TOTAL_IMAGES_WITHOUT_INDICATOR;
  const visibleThumbnailsCount = hasMoreImages
    ? MAX_VISIBLE_THUMBNAILS - 1
    : MAX_VISIBLE_THUMBNAILS;
  const remainingImagesCount = assets.length - (visibleThumbnailsCount + 1); // +1 for the main image

  // Function to open lightbox with specific image
  const openLightbox = (index: number) => {
    setImageIndex(index);
    setOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Main Image */}
      <div 
        className="relative h-96 w-full cursor-pointer overflow-hidden rounded-xl group"
        onClick={() => openLightbox(0)}
      >
        <div className="relative w-full h-full overflow-hidden">
          <AssetItem
            url={assets[0] ?? PLACEHOLDER_IMAGE}
            title={title}
            index={0}
            className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-2 gap-2 h-96">
        {[1, 2, 3, 4].map((index) => {
          const asset = assets[index];
          if (!asset) return null;
          
          return (
            <div 
              key={index} 
              className="relative cursor-pointer overflow-hidden rounded-lg group/grid"
              onClick={() => openLightbox(index)}
            >
              <AssetItem
                url={asset}
                title={title}
                index={index}
                className="object-cover w-full h-full transition-all duration-700 group-hover/grid:scale-110 group-hover/grid:brightness-110"
              />
              {index === 3 && assets.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">+{assets.length - 5} more</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Lightbox Component */}
      {open && (
        <LazyLightbox
          open={open}
          close={() => setOpen(false)}
          slides={lightboxImages as any}
          index={imageIndex}
          counter={{
            container: { style: { top: "unset", bottom: 0, left: 0 } },
          }}
          thumbnails={{
            position: "bottom",
            width: 120,
            height: 80,
            border: 2,
            borderRadius: 4,
            padding: 4,
            gap: 8,
          }}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 2,
          }}
          carousel={{
            finite: true,
          }}
          render={{
            buttonPrev: assets.length <= 1 ? () => null : undefined,
            buttonNext: assets.length <= 1 ? () => null : undefined,
          }}
        />
      )}
    </div>
  );
}

const AssetItem = ({
  url,
  index,
  title,
  className,
  priority,
}: AssetItemProps) => {
  const isUrlVideo = isVideo(url);

  return isUrlVideo ? (
    <div className="relative size-full">
      <video
        className={className}
        src={url}
      ></video>
      <div className={`absolute left-1/2 top-1/2 grid ${priority ? 'size-16' : 'size-8'} -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white hover:bg-black`}>
        <Play className={priority ? 'size-8' : ''} />
      </div>
    </div>
  ) : (
    <Image
      src={url || PLACEHOLDER_IMAGE}
      alt={index === 0 ? title : `${title} - image ${index + 2}`}
      fill
      className={className}
      priority={priority}
    />
  );
};

interface AssetItemProps {
  url: string;
  index: number;
  title: string;
  className?: string;
  priority?: boolean;
}
