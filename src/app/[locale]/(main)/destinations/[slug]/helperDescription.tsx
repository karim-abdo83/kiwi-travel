const clampSeoDescription = (text: string): string => {
  const MIN = 150;
  const MAX = 165;

  let result = text.trim();


  if (result.length > MAX) {
    result = result.slice(0, MAX);
    result = result.slice(0, result.lastIndexOf(" "));
  }


  if (result.length < MIN) {
    result += " Discover unforgettable travel experiences with Karim Tour.";
    result = result.slice(0, MAX);
  }

  return result;
};


export const getSeoDescription = ({
  locale,
  name,
  tripsCount,
}: {
  locale: string;
  name: string;
  tripsCount?: number;
}): string => {
  let base: string;

  switch (locale) {
    case "en":
      base = `Discover the best trips and tours in ${name}, featuring expert guides, carefully planned itineraries, and unique travel experiences${
        tripsCount ? ` with ${tripsCount} available options` : ""
      }. Explore top attractions and book your journey with Karim Tour today.`;
      break;

    case "ru":
      base = `Откройте для себя лучшие туры и поездки в ${name} с профессиональными гидами, продуманными маршрутами и уникальными впечатлениями${
        tripsCount ? ` — доступно ${tripsCount} вариантов` : ""
      }. Посетите главные достопримечательности и бронируйте с Karim Tour.`;
      break;

    case "tr":
      base = `${name} bölgesindeki en iyi turları keşfedin. Profesyonel rehberler, özenle hazırlanmış programlar ve unutulmaz seyahat deneyimleri${
        tripsCount ? ` (${tripsCount} farklı tur seçeneği)` : ""
      }. Karim Tour ile hemen güvenle rezervasyon yapın.`;
      break;

    default:
      base = `Explore the best tours and travel experiences in ${name} with expert guides, curated itineraries, and unforgettable moments. Book your trip with Karim Tour today.`;
  }

  return clampSeoDescription(base);
};


