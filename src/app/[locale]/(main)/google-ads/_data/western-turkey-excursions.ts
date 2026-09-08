export interface CleanTripDefinition {
  title: string;
  slug: string;
}

export const ALANYA_TRIPS = [
  { title: "Alanya City Tour", slug: "alanya-city-tour-cable-car" },
  { title: "Dolphin Discovery Cruise", slug: "dolphin-discovery-cruise" },
  {
    title: "Alanya Buggy Safari",
    slug: "alanya-buggy-safari-experience-with-free-hotel-transfer",
  },
  {
    title: "Alanya Rafting",
    slug: "alanya-whitewater-rafting-adventure-in-kprl-canyon",
  },
  {
    title: "Alanya 5-in-1 Adventure Combo",
    slug: "alanya-combo-rafting-zipline-canyon-atvbuggy-lunch",
  },
  {
    title: "Sapadere Canyon",
    slug: "from-alanya-sapadere-canyon-full-day-sightseeing-tour",
  },
  {
    title: "Alanya Pirate Boat",
    slug: "alanya-pirates-boat-tour-with-lunch-and-drinks",
  },
  {
    title: "Alanya Quad Safari",
    slug: "alanya-quad-safari-experience-with-free-hotel-transfer",
  },
  {
    title: "Altinbesik Cave & Ormana",
    slug: "alanya-full-day-altinbesik-cave-ormana-village-guided-tour",
  },
  {
    title: "Alanya Jeep Safari",
    slug: "from-alanya-jeep-safari-adventure-with-lunch-and-transfer",
  },
  {
    title: "Tazi Canyon & Selge",
    slug: "tazi-canyon-and-selge-ancient-city",
  },
  {
    title: "Starcraft Yacht",
    slug: "alanya-starcraft-foam-party-and-all-inclusive-boat-tour",
  },
  { title: "Sea Fishing Alanya", slug: "alanya-fishing-tour" },
  {
    title: "Alanya Scuba Diving",
    slug: "alanya-scuba-diving-with-pickup-lunch-and-2-dives",
  },
  {
    title: "Green Canyon from Alanya",
    slug: "green-canyon-tour-from-alanya",
  },
  {
    title: "Turkish Bath",
    slug: "alanya-turkish-bath-with-peeling-foam-and-oil-massage",
  },
  {
    title: "Cappadocia 2-Day Tour",
    slug: "cappadocia-2-day-tour-from-alanya",
  },
  {
    title: "Pamukkale & Salda",
    slug: "from-alanya-pamukkale-and-salda-lake-day-trip-all-inclusive",
  },
] as const satisfies readonly CleanTripDefinition[];

export const ANTALYA_TRIPS = [
  {
    title: "Cappadocia 2-Day Tour",
    slug: "cappadocia-2-day-tour-from-antalya",
  },
  {
    title: "Pamukkale Day Tour",
    slug: "antalya-full-day-pamukkale-and-hierapolis-tour",
  },
  {
    title: "Demre Myra Kekova",
    slug: "from-antalya-excursion-to-demre-myra-kekova-sunken-city-with-lunch-transfer",
  },
  {
    title: "Antalya City Tour",
    slug: "antalya-old-city-tour-waterfall-boat-lunch",
  },
  {
    title: "Suluada Island",
    slug: "antalya-suluada-island-boat-trip-with-lunch-hotel-pickup",
  },
  {
    title: "Galleon Pirate Yacht",
    slug: "pirate-yacht-galleon-from-antalya",
  },
  {
    title: "Tazi Canyon & Selge",
    slug: "from-antalya-tazi-canyon-selge-ancient-city-tour-wlunch",
  },
  {
    title: "Alanya Paragliding from Antalya",
    slug: "antalya-tandem-paragliding-from-700m-with-hotel-pickup",
  },
  {
    title: "Antalya Jeep Safari",
    slug: "from-antalya-jeep-safari-adventure-with-lunch-and-transfer",
  },
  {
    title: "Antalya 5-in-1 Adventure Combo",
    slug: "antalya-combo-rafting-zipline-canyon-atvbuggy-lunch",
  },
  {
    title: "Antalya Rafting",
    slug: "antalya-whitewater-rafting-adventure-in-kprl-canyon",
  },
  {
    title: "Green Canyon from Antalya",
    slug: "green-canyon-tour-from-antalya",
  },
  {
    title: "Kas & Kaputas Beach",
    slug: "kas-kaputas-beach-tour-from-antalya",
  },
] as const satisfies readonly CleanTripDefinition[];

export const KEMER_TRIPS = [
  {
    title: "Suluada Island",
    slug: "kemer-suluada-island-boat-trip-with-lunch-hotel-pickup",
  },
  { title: "Porto Dzheneviz", slug: "secrets-of-porto-dzheneviz-bay" },
  {
    title: "Kas & Kaputas Beach",
    slug: "kas-kaputas-beach-tour-from-kemer",
  },
  {
    title: "Gonster Pirate Boat",
    slug: "kemer-gonster-pirate-ship-with-foam-party-free-lunchdrinks-and-swim-breaks",
  },
  {
    title: "Kemer 5-in-1 Adventure Combo",
    slug: "kemer-combo-rafting-zipline-canyon-atvbuggy-lunch",
  },
  {
    title: "Demre Myra Kekova",
    slug: "from-kemer-excursion-to-demre-myra-kekova-sunken-city-with-lunch-transfer",
  },
  {
    title: "Cappadocia 2-Day Tour",
    slug: "cappadocia-2-day-tour-from-kemer",
  },
  {
    title: "Goynuk Canyon",
    slug: "kemer-tours-and-tickets-to-experience-goynuk-canyon",
  },
  {
    title: "Chimaera & Ulupinar Dinner",
    slug: "kemer-jeep-safari-to-olympos-beach-the-flames-of-chimera",
  },
  {
    title: "Pamukkale & Salda",
    slug: "from-kemer-pamukkale-and-salda-lake-day-trip-all-inclusive",
  },
  {
    title: "Antalya City Tour from Kemer",
    slug: "from-kemer-antalya-old-city-tour-waterfall-boat-lunch",
  },
  {
    title: "Kemer Quad Safari",
    slug: "kemer-quad-safari-experience-with-free-hotel-transfer",
  },
  {
    title: "Kemer Buggy Safari",
    slug: "kemer-buggy-safari-experience-with-free-hotel-transfer",
  },
  {
    title: "Mega Star Yacht",
    slug: "kemer-megastar-catamaran-cruise-with-foam-party-free-lunch-and-swim-breaks",
  },
] as const satisfies readonly CleanTripDefinition[];
