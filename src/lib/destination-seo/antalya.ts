import type { DestinationSeoConfig } from "./types";

// Trip slugs used in links. Kept here so texts, chips and priorities stay in sync.
const DEMRE = "from-antalya-excursion-to-demre-myra-kekova-sunken-city-with-lunch-transfer";
const CAPPADOCIA_3D = "3-day-cappadocia-tour-from-antalya";
const CAPPADOCIA_2D = "cappadocia-2-day-tour-from-antalya";
const PAMUKKALE = "antalya-full-day-pamukkale-and-hierapolis-tour";
const PAMUKKALE_BALLOON = "antalya-pamukkale-tour-with-hot-air-balloon-flight";
const AQUARIUM = "antalya-aquarium-with-entrance-transfer";
const LEGENDS_SHOW = "from-antalyaland-of-legends-night-show";
const LEGENDS_PARK = "from-antalya-the-land-of-legends-theme-park-entrance-ticket-transfer";
const GREEN_CANYON = "green-canyon-tour-from-antalya";

export const antalya: DestinationSeoConfig = {
  slug: "antalya-day-tours",

  meta: {
    ru: {
      title: "Экскурсии из Антальи по лучшим ценам | Karim Tour",
      description:
        "Экскурсии из Анталии в низкий сезон: Памуккале, Каппадокия, Демре–Мира–Кекова, аквариум и шоу Land of Legends. Трансфер из отеля, бронируйте сегодня.",
      h1: "Экскурсии из Анталии",
    },
    en: {
      title: "Antalya Excursions & Day Tours at Best Prices | Karim Tour",
      description:
        "Antalya day trips in low season: Pamukkale, Cappadocia, Demre–Myra–Kekova, the Antalya Aquarium and the Land of Legends show. Hotel transfer, book today.",
      h1: "Antalya Day Tours & Excursions",
    },
    // tr: pending texts
  },

  breadcrumbLabel: { ru: "Анталья", en: "Antalya" },

  season: {
    lowSeason: true,
    notice: {
      ru: "Низкий сезон: морские прогулки вернутся в следующем сезоне. Сейчас работают:",
      en: "Low season: boat trips return next season. Running now:",
    },
    chips: [
      { slug: PAMUKKALE, label: { ru: "Памуккале", en: "Pamukkale" } },
      { slug: CAPPADOCIA_3D, label: { ru: "Каппадокия", en: "Cappadocia" } },
      { slug: DEMRE, label: { ru: "Демре–Мира–Кекова", en: "Demre–Myra–Kekova" } },
      { slug: GREEN_CANYON, label: { ru: "Зелёный каньон", en: "Green Canyon" } },
      { slug: AQUARIUM, label: { ru: "Аквариум", en: "Aquarium" } },
      { slug: LEGENDS_SHOW, label: { ru: "Land of Legends", en: "Land of Legends" } },
    ],
    tripPageNotice: {
      ru: "Низкий сезон: эта экскурсия вернётся в следующем сезоне. Сейчас работают:",
      en: "Low season: this tour returns next season. Running now:",
    },
    lastTripTypes: ["Diving", "Sea adventure", "Cruise Vacation", "Beach Vacation"],
  },

  intro: {
    ru: {
      lead: "В низкий сезон главные экскурсии из Антальи продолжают работать.",
      body: [
        `[Памуккале](trip:${PAMUKKALE}) (14 часов, от €34): травертиновые террасы и античный Иераполис. Есть варианты с озером Салда и с полётом на воздушном шаре. [Каппадокия из Анталии](trip:${CAPPADOCIA_3D}): тур на 2 или 3 дня с подземными городами, долинами и рассветом среди воздушных шаров. [Демре–Мира–Кекова](trip:${DEMRE}) (14 часов, от €45): церковь Святого Николая, ликийские гробницы Миры и затонувший город Кекова. Обед и трансфер включены.`,
        `Ближе к Анталье: [Зелёный каньон](trip:${GREEN_CANYON}): прогулка на катере по изумрудному озеру (9 часов, от €40). [Аквариум Анталии](trip:${AQUARIUM}): самый длинный туннельный аквариум в мире (от €55 с билетом и трансфером). [The Land of Legends](trip:${LEGENDS_SHOW}): тематический парк днём и вечернее шоу с парадом лодок и фейерверком (от €13).`,
      ],
    },
    en: {
      lead: "In low season, the main day tours from Antalya keep running.",
      body: [
        `[Pamukkale from Antalya](trip:${PAMUKKALE}) (14 hours, from €34): the travertine terraces and the ancient city of Hierapolis. Options with Salda Lake or a hot air balloon flight. [Cappadocia from Antalya](trip:${CAPPADOCIA_3D}): 2- or 3-day tours with underground cities, valleys and sunrise among the balloons. [Demre–Myra–Kekova](trip:${DEMRE}) (14 hours, from €45): the Church of St Nicholas, the Lycian rock tombs of Myra and the Kekova sunken city. Lunch and transfer included.`,
        `Closer to the city: [Green Canyon](trip:${GREEN_CANYON}): a boat trip on an emerald lake (9 hours, from €40). [Antalya Aquarium](trip:${AQUARIUM}): the world's longest tunnel aquarium (from €55 with ticket and transfer). [The Land of Legends](trip:${LEGENDS_SHOW}): a theme park by day and a night show with a boat parade and fireworks (from €13).`,
      ],
    },
  },

  faq: {
    ru: {
      title: "Экскурсии из Анталии: частые вопросы",
      items: [
        {
          question: "Какие экскурсии из Анталии работают в низкий сезон?",
          answer: `Памуккале, Каппадокия, Демре–Мира–Кекова, [Зелёный каньон](trip:${GREEN_CANYON}), аквариум и The Land of Legends. Морские прогулки вернутся в следующем сезоне.`,
        },
        {
          question: "Можно ли съездить в Памуккале из Анталии за один день?",
          answer: `Да. [Памуккале](trip:${PAMUKKALE}) находится примерно в 240 км, экскурсия длится около 14 часов, цена от €34 с трансфером. Есть варианты с озером Салда и с полётом на шаре.`,
        },
        {
          question: "Как съездить в Каппадокию из Анталии?",
          answer: `До Каппадокии около 550 км, поэтому однодневный тур не рекомендуем. Есть [туры на 2 и 3 дня](trip:${CAPPADOCIA_3D}) с трансфером, подземным городом, долинами Гёреме и рассветом с шарами.`,
        },
        {
          question: "Сколько стоит аквариум в Анталии?",
          answer: `От €55 с билетом и трансфером, около 5 часов. Это самый длинный туннельный [аквариум](trip:${AQUARIUM}) в мире.`,
        },
        {
          question: "Что входит в экскурсию Демре–Мира–Кекова?",
          answer: `Церковь Святого Николая в [Демре](trip:${DEMRE}), гробницы Миры, лодка к затонувшему городу Кекова, обед и трансфер. 14 часов, от €45.`,
        },
        {
          question: "Полёт на воздушном шаре гарантирован?",
          answer: `В низкий сезон полёты в Каппадокии и [Памуккале](trip:${PAMUKKALE_BALLOON}) зависят от погоды. Если шары не летят, программа тура проходит без полёта.`,
        },
        {
          question: "Куда сходить в Анталии с детьми в низкий сезон?",
          answer: `В аквариум Анталии с самым длинным туннелем в мире (от €55 с трансфером) и в парк [The Land of Legends](trip:${LEGENDS_PARK}): днём аттракционы, вечером шоу с парадом лодок и фейерверком (от €13).`,
        },
      ],
    },
    en: {
      title: "Antalya tours: frequently asked questions",
      items: [
        {
          question: "Which Antalya tours are available in low season?",
          answer: `Pamukkale, Cappadocia, Demre–Myra–Kekova, [Green Canyon](trip:${GREEN_CANYON}), the Antalya Aquarium and The Land of Legends. Boat trips return next season.`,
        },
        {
          question: "Can I do Pamukkale as a day trip from Antalya?",
          answer: `Yes. [Pamukkale](trip:${PAMUKKALE}) is about 240 km away, and the tour takes around 14 hours, from €34 with transfer. Options with Salda Lake or a balloon flight are available.`,
        },
        {
          question: "How do I visit Cappadocia from Antalya?",
          answer: `It's about 550 km away, so a day trip isn't recommended. There are [2- and 3-day tours](trip:${CAPPADOCIA_3D}) with transfer, the underground city, the Göreme valleys and the balloon sunrise.`,
        },
        {
          question: "How much is the Antalya Aquarium?",
          answer: `From €55 with ticket and transfer, about 5 hours. It's the world's longest tunnel [aquarium](trip:${AQUARIUM}).`,
        },
        {
          question: "What does the Demre–Myra–Kekova tour include?",
          answer: `The Church of St Nicholas in [Demre](trip:${DEMRE}), the Myra rock tombs, a boat trip over the Kekova sunken city, lunch and transfer. 14 hours, from €45.`,
        },
        {
          question: "Are hot air balloon flights guaranteed?",
          answer: `In low season, balloon flights in Cappadocia and [Pamukkale](trip:${PAMUKKALE_BALLOON}) depend on the weather. If the balloons don't fly, the rest of the tour goes ahead as planned.`,
        },
        {
          question: "What can I do in Antalya with kids in low season?",
          answer: `Visit the Antalya Aquarium, which has the world's longest tunnel aquarium (from €55 with transfer), or [The Land of Legends](trip:${LEGENDS_PARK}): theme park rides by day and a night show with a boat parade and fireworks (from €13).`,
        },
      ],
    },
  },

  trips: {
    priority: [
      // Block 1: confirmed active
      DEMRE,
      CAPPADOCIA_3D,
      CAPPADOCIA_2D,
      PAMUKKALE,
      AQUARIUM,
      LEGENDS_SHOW,
      GREEN_CANYON,
      LEGENDS_PARK,
      "from-antalya-pamukkale-and-salda-lake-day-trip-all-inclusive",
      PAMUKKALE_BALLOON,
      // Block 2: land tours
      "from-antalya-jeep-safari-adventure-with-lunch-and-transfer",
      "antalya-olympos-cable-car-tahtali-mountains-with-transfer",
      "antalya-quad-safari-experience-with-free-hotel-transfer",
      "antalya-buggy-safari-experience-with-free-hotel-transfer",
      "from-antalya-tazi-canyon-selge-ancient-city-tour-wlunch",
      "antalya-combo-rafting-zipline-canyon-atvbuggy-lunch",
      "kombo-tazi-6-in-1",
      "antalya-whitewater-rafting-adventure-in-kprl-canyon",
      "from-antalya-istanbul-guided-tour-including-domestic-flights",
      "antalya-turkish-bath-with-peeling-foam-and-oil-massage",
      "antalya-dolphin-show-tour",
      "antalya-tandem-paragliding-from-700m-with-hotel-pickup",
      "antalya-old-city-tour-waterfall-boat-lunch",
      // Block 3: doubtful
      "antalya-fire-of-anatolia-troy-show-with-transfer",
      "antalya-manavgat-river-cruise-waterfalls-and-market-tour",
      "kas-kaputas-beach-tour-from-antalya",
      // Block 4: water tours
      "antalya-suluada-island-boat-trip-with-lunch-hotel-pickup",
      "antalya-pirate-boat-tour-duden-waterfall",
      "pirate-yacht-galleon-from-antalya",
      "antalya-gonster-pirate-ship-with-foam-party-free-lunchdrinks-and-swim-breaks",
      "antalya-megastar-catamaran-cruise-with-foam-party-free-lunch-and-swim-breaks",
      "antalya-scuba-diving-with-pickup-lunch-and-2-dives",
      "antalya-fishing-tour-by-boat",
      "antalya-dolusu-aquapark-tour-unlimited-fun-on-water-slides",
    ],

    off: [],
    // A service, not an excursion.
    hidden: ["transfer-fromto-antalya-airport"],
  },
};
