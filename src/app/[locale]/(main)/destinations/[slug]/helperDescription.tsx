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


/**
 * Fallback meta description for destinations without custom SEO texts.
 * `name` is the destination title (e.g. "Antalya Day Tours"), so it is used as a heading,
 * never inside "in …"; the trip count is left out because it changes and is shown on the page.
 */
export const getSeoDescription = ({
  locale,
  name,
}: {
  locale: string;
  name: string;
}): string => {
  let base: string;

  switch (locale) {
    case "ru":
      base = `${name} с Karim Tour: лучшие экскурсии с опытными гидами, понятные цены и удобное онлайн-бронирование. Сравните туры и бронируйте сегодня.`;
      break;

    case "tr":
      base = `${name} – Karim Tour: deneyimli rehberler, şeffaf fiyatlar ve kolay online rezervasyon ile seçkin turlar. Turları karşılaştırın, bugün rezervasyon yapın.`;
      break;

    default:
      base = `${name} with Karim Tour: hand-picked excursions with expert guides, clear prices and easy online booking. Compare tours and book your trip today.`;
  }

  return clampSeoDescription(base);
};


