type Locale = "en" | "tr" | "ru";

type PageSlug =
  | "sharm-el-sheikh-day-tours"
  | "hurghada-day-tours"
  | "cairo-day-tours"
  | "marsa-alam-day-tours";

type ContentSection = {
  title: string;
  items: string[];
};

type FaqItem = {
  question: string;
  answer: string;
};

export type PageExtraRuContent = {
  sections: ContentSection[];
  faq: FaqItem[];
};

type PageExtraRuMap = Partial<
  Record<PageSlug, PageExtraRuContent>
>;

type IntroByLocale = Record<Locale, string>;

type IntroMap = Record<PageSlug, IntroByLocale>;

const PAGE_INTROS: IntroMap = {
  "sharm-el-sheikh-day-tours": {
    ru: `Экскурсии из Шарм-эль-Шейха — это лучший способ открыть для себя Египет ярко, комфортно и без лишних забот. Мы предлагаем морские прогулки по Красному морю, сафари по Синаю, дайвинг, аквапарки и исторические экскурсии в Каир, Луксор, Иерусалим и Петру.

Наши туры особенно популярны среди туристов из Турции благодаря высокому уровню сервиса, профессиональным гидам и надёжной организации.

Выберите экскурсию из Шарм-эль-Шейха и наслаждайтесь отдыхом — обо всём остальном позаботимся мы.`,

    en: `Sharm El Sheikh Day Tours are the perfect way to explore Egypt in comfort and safety. Enjoy Red Sea cruises, diving experiences, Sinai desert safaris, and cultural trips to Cairo, Luxor, Jerusalem, and Petra.

Our tours are especially popular among Turkish travelers thanks to our high service standards, professional guides, and reliable organization.

Choose your Sharm El Sheikh tour and relax — we take care of everything.`,

    tr: `Şarm El-Şeyh çıkışlı turlar, Mısır’ı konforlu ve güvenli şekilde keşfetmenin en iyi yoludur. Kızıldeniz tekne turları, dalış deneyimleri, Sina Çölü safarileri ve Kahire, Luksor, Kudüs ile Petra’ya uzanan kültürel geziler sunuyoruz.

Turlarımız özellikle Türk misafirler tarafından yüksek hizmet kalitesi ve profesyonel organizasyon nedeniyle tercih edilmektedir.

Şarm El-Şeyh’te tatilin keyfini çıkarın, gerisini bize bırakın.`
  },

  "hurghada-day-tours": {
    ru: `Экскурсии из Хургады — это уникальная возможность увидеть Египет во всём его многообразии: от кристально чистых вод Красного моря до древних храмов и бескрайних пустынных пейзажей.

Вас ждут морские прогулки к райским островам, дайвинг и снорклинг, сафари по пустыне, семейные развлечения и насыщенные экскурсии в Луксор и Каир. Для ценителей комфорта доступны VIP-туры и аренда яхт.

Выбирайте экскурсии из Хургады и наслаждайтесь отдыхом без забот — профессиональная организация сделает ваше путешествие незабываемым.`,

    en: `Hurghada Day Tours offer the perfect mix of Red Sea relaxation, desert adventure, and ancient Egyptian history. From crystal-clear islands and vibrant coral reefs to desert safaris and cultural excursions.

Enjoy snorkeling, diving, island cruises, family-friendly activities, and unforgettable trips to Luxor and Cairo. For those seeking comfort and exclusivity, VIP tours and private yacht rentals are available.

Choose Hurghada excursions and experience Egypt with ease, comfort, and professional service.`,

    tr: `Hurghada çıkışlı turlar, Kızıldeniz’in eşsiz güzelliklerini, çöl maceralarını ve Antik Mısır’ın zengin tarihini bir araya getirir.

Ada turları, dalış ve şnorkelle yüzme, çöl safarileri, aile dostu aktiviteler ve Luksor ile Kahire’ye kültürel geziler sizleri bekliyor. Konfor arayanlar için VIP turlar ve özel yat kiralama seçenekleri sunulmaktadır.

Hurghada turlarını seçin, Mısır’ı güvenli ve keyifli bir şekilde keşfedin.`
  },

  "cairo-day-tours": {
    ru: `Экскурсии из Каира — это путешествие в самое сердце истории Египта. Великие пирамиды Гизы, Сфинкс, музеи, древние кварталы и современная жизнь столицы создают уникальное сочетание прошлого и настоящего.

Из Каира доступны экскурсии к пирамидам, в Гранд Египетский музей, Исламский и Коптский Каир, вечерние круизы по Нилу, а также поездки в Александрию, Луксор и оазисы.

Экскурсии из Каира подойдут тем, кто хочет глубоко познакомиться с культурой, историей и атмосферой настоящего Египта.`,

    en: `Cairo Day Tours take you to the heart of Egypt’s ancient and modern history. From the Great Pyramids of Giza and the Sphinx to museums, mosques, and vibrant city streets.

Explore Islamic and Coptic Cairo, enjoy Nile dinner cruises, visit the Grand Egyptian Museum, or travel to Alexandria, Luxor, and desert oases.

Cairo excursions are perfect for travelers seeking culture, history, and unforgettable experiences in Egypt’s legendary capital.`,

    tr: `Kahire çıkışlı turlar, Mısır’ın binlerce yıllık tarihi ile modern yaşamını bir arada keşfetme fırsatı sunar. Giza Piramitleri, Sfenks, müzeler ve tarihi mahalleler sizi geçmişe götürür.

İslami ve Kıpti Kahire, Nil üzerinde akşam yemekli turlar, Büyük Mısır Müzesi, ayrıca İskenderiye ve Luksor gezileri bu turların öne çıkan seçenekleridir.

Kahire turları, Mısır’ın kültürünü ve tarihini derinlemesine keşfetmek isteyenler için idealdir.`
  },

  "marsa-alam-day-tours": {
    ru: `Экскурсии из Марса-Алама — идеальный выбор для любителей природы, спокойствия и подводного мира. Этот регион известен нетронутыми коралловыми рифами и богатой морской фауной.

Вас ждут морские прогулки к дельфинам и черепахам, батискафы, сафари по пустыне и экскурсии в Луксор и Каир с посещением пирамид и музеев.

Экскурсии из Марса-Алама подарят гармонию моря, пустыни и истории в одном путешествии.`,

    en: `Marsa Alam Day Tours are perfect for travelers seeking pristine nature, marine life, and authentic adventures. The region is famous for untouched coral reefs and a peaceful atmosphere.

Enjoy dolphin and turtle excursions, glass-bottom boat trips, desert safaris, and cultural journeys to Luxor and Cairo, including the pyramids and museums.

Marsa Alam excursions combine nature, sea, and history for a truly unforgettable experience.`,

    tr: `Marsa Alam çıkışlı turlar, doğa, deniz ve huzur arayan gezginler için mükemmel bir seçenektir. Bölge, el değmemiş mercan resifleri ve zengin deniz yaşamıyla ünlüdür.

Yunus ve kaplumbağa turları, batiskaf gezileri, çöl safarileri ve Luksor ile Kahire’ye kültürel geziler sunulmaktadır.

Marsa Alam turları, deniz, çöl ve tarihi bir arada yaşamak isteyenler için eşsiz bir deneyim sunar.`
  }
};

const PAGE_EXTRA_RU_CONTENT: PageExtraRuMap = {
  "sharm-el-sheikh-day-tours": {
    sections: [
      {
        title: "Почему стоит выбрать экскурсии из Шарм-эль-Шейха?",
        items: [
          "Огромный выбор экскурсий: море, пустыня, история и развлечения",
          "Идеальная отправная точка для поездок в Каир, Луксор, Петру и Иерусалим",
          "Профессиональные русскоговорящие гиды",
          "Современный транспорт и высокий уровень безопасности",
          "Подходит для семей, пар и любителей активного отдыха"
        ]
      },
      {
        title: "Что включают экскурсии из Шарм-эль-Шейха",
        items: [
          "Морские прогулки к островам Тиран и Белый остров",
          "Дайвинг и снорклинг в Красном море с коралловыми рифами",
          "Сафари на квадроциклах, багги и джипах по Синайской пустыне",
          "Экскурсии в Каир и Луксор с посещением пирамид и храмов",
          "Развлечения для всей семьи: аквапарки, батискаф, шоу дельфинов"
        ]
      },
      {
        title: "Комфорт и организация туров",
        items: [
          "Групповые и индивидуальные экскурсии",
          "VIP-туры и аренда частных яхт",
          "Трансфер из отеля и обратно",
          "Поддержка туристов 24/7 на русском языке"
        ]
      }
    ],

    faq: [
      {
        question: "Безопасны ли экскурсии из Шарм-эль-Шейха?",
        answer:
          "Да, все экскурсии проводятся официально, с лицензированными гидами, современным транспортом и соблюдением всех мер безопасности."
      },
      {
        question: "Подходят ли экскурсии для отдыха с детьми?",
        answer:
          "Да, в Шарм-эль-Шейхе есть множество экскурсий для семей с детьми, включая аквапарки, морские прогулки и развлекательные шоу."
      },
      {
        question: "Можно ли заказать индивидуальную экскурсию?",
        answer:
          "Да, доступны индивидуальные и VIP-экскурсии, а также аренда яхт и персональные маршруты."
      },
      {
        question: "Нужно ли бронировать экскурсии заранее?",
        answer:
          "Рекомендуется бронировать заранее, особенно в высокий туристический сезон, чтобы гарантировать наличие мест."
      }
    ]
  },
    "hurghada-day-tours": {
    sections: [
      {
        title: "Лучшие впечатления от Хургады",
        items: [
          "Снорклинг и дайвинг в кристально чистых водах Красного моря",
          "Прогулки на яхтах и круизы по заливам и островам",
          "Сафари на джипах и квадроциклах в пустыне Хургады",
          "Визиты к историческим достопримечательностям: Луксор и Каир",
          "Семейные развлечения: аквапарки, шоу дельфинов и морских звёзд",
          "VIP-туры и частные трансферы для максимального комфорта"
        ]
      },
      {
        title: "Советы для путешественников",
        items: [
          "Бронируйте экскурсии заранее, чтобы гарантировать место",
          "Берите солнцезащитный крем и головной убор",
          "Не забудьте купальник, маску и ласты для дайвинга",
          "Для сафари и джип-туров удобная обувь и лёгкая одежда",
          "Следите за гидом и соблюдайте правила безопасности"
        ]
      }
    ],
    faq: [
      {
        question: "Можно ли плавать с дельфинами в Хургаде?",
        answer: "Да, у нас есть несколько программ плавания с дельфинами, включая посещение 'Дома дельфинов' и морские экскурсии к рифам."
      },
      {
        question: "Есть ли семейные экскурсии для детей?",
        answer: "Да, мы предлагаем семейные туры с аквапарками, сафари на квадроциклах и мягкие морские прогулки."
      },
      {
        question: "Можно ли заказать VIP-тур или частную яхту?",
        answer: "Да, доступны VIP-туры и аренда яхт с персональным гидом и экипажем."
      },
      {
        question: "Сколько длится экскурсия в Луксор из Хургады?",
        answer: "Экскурсия в Луксор обычно занимает полный день и включает посещение храмов и Долины царей."
      },
      {
        question: "Можно ли сочетать морские прогулки и сафари?",
        answer: "Да, мы предлагаем комбинированные туры: день на море и сафари в пустыне в один день."
      }
    ]
  },

  "cairo-day-tours": {
    sections: [
      {
        title: "Культурные и исторические экскурсии",
        items: [
          "Визит к Великим пирамидам Гизы и Сфинксу",
          "Обзорная экскурсия по Исламскому и Коптскому Каиру",
          "Посещение Гранд Египетского музея",
          "Вечерние круизы по Нилу с ужином и шоу",
          "Однодневные и экспресс-туры по столице"
        ]
      },
      {
        title: "Практические советы для экскурсий в Каире",
        items: [
          "Рекомендуется взять удобную обувь для прогулок",
          "Берите воду и головной убор в летнее время",
          "Старайтесь планировать экскурсии на утро для комфортной температуры",
          "Обязательно наличие камеры и блокнота для заметок о достопримечательностях"
        ]
      }
    ],
    faq: [
      {
        question: "Можно ли посетить все пирамиды за один день?",
        answer: "Да, есть экскурсии «Гиза, Саккара и Дахшур» за один день, но это насыщенный график."
      },
      {
        question: "Включены ли трансферы в экскурсии из Каира?",
        answer: "Да, большинство экскурсий включают трансфер из/до вашего отеля или аэропорта."
      },
      {
        question: "Можно ли заказать вечерний круиз по Нилу?",
        answer: "Да, есть программы вечернего круиза с ужином и шоу-программой."
      },
      {
        question: "Есть ли экскурсии в Александрию?",
        answer: "Да, доступны однодневные туры в Александрию из Каира с гидом."
      },
      {
        question: "Можно ли заказать VIP-трансфер?",
        answer: "Да, доступны VIP-трансферы с комфортными автомобилями и персональным водителем."
      }
    ]
  },

  "marsa-alam-day-tours": {
    sections: [
      {
        title: "Лучшие впечатления из Марса-Алама",
        items: [
          "Морские прогулки к коралловым рифам и Дом дельфинов",
          "Батискаф Sea Scope — подводный мир без дайвинга",
          "Сафари на квадроциклах и джипах по пустыне",
          "Посещение Луксора и Каира — исторические экскурсии",
          "Райские острова Хамата — отдых на Красном море",
          "VIP-трансферы и премиум-программы для максимального комфорта"
        ]
      },
      {
        title: "Советы для путешественников",
        items: [
          "Берите купальник, маску и ласты для морских экскурсий",
          "Для сафари и джип-туров — удобная одежда и обувь",
          "Солнцезащитный крем и головной убор обязательны",
          "Следуйте инструкциям гида для безопасности и комфортного отдыха"
        ]
      }
    ],
    faq: [
      {
        question: "Можно ли плавать с дельфинами из Марса-Алама?",
        answer: "Да, экскурсии включают морские прогулки к рифу Сатайя и Дом дельфинов."
      },
      {
        question: "Есть ли семейные экскурсии?",
        answer: "Да, доступны сафари для всей семьи, морские прогулки и батискафные туры."
      },
      {
        question: "Можно ли заказать VIP-тур?",
        answer: "Да, предлагаются VIP-туры с персональным гидом и трансфером."
      },
      {
        question: "Какие морские активности доступны?",
        answer: "Дайвинг, снорклинг, морские прогулки, батискаф Sea Scope и посещение островов Хамата."
      },
      {
        question: "Можно ли совместить экскурсии на море и в пустыне?",
        answer: "Да, комбинированные туры позволяют за один день насладиться и морем, и пустыней."
      }
    ]
  }
};


export const getPageIntro = ({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}): string => {
  const page = PAGE_INTROS[slug as PageSlug];

  if (!page) return "";

  return page[locale as keyof typeof page] ?? page.en;
};

export const getPageExtraRuContent = ({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}): PageExtraRuContent | null => {
  if (locale !== "ru") return null;

  const page = PAGE_EXTRA_RU_CONTENT[slug as PageSlug];
  if (!page) return null;

  return page;
};






