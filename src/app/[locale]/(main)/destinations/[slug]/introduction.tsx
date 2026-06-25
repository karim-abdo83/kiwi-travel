export type Locale = "en" | "tr" | "ru";

export type PageSlug =
  | "sharm-el-sheikh-day-tours"
  | "hurghada-day-tours"
  | "cairo-day-tours"
  | "marsa-alam-day-tours";

export type ContentSection = {
  title: string;
  items: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type PageExtraContent = {
  sections: ContentSection[];
  faq: FaqItem[];
};

type GeneralFaqCategory = "payment" | "cancellation" | "refund";

type GeneralFaqItem = FaqItem & {
  category: GeneralFaqCategory;
};

const GENERAL_DESTINATION_FAQS: Record<Locale, GeneralFaqItem[]> = {
  en: [
    {
      category: "payment",
      question: "What is the payment policy?",
      answer:
        "For most group excursions, advance payment is not required. You can reserve online and pay on the day of the trip. Some tours, such as flights, private tours, or cross-border trips, may require advance payment or full prepayment.",
    },
    {
      category: "cancellation",
      question: "What is the cancellation policy?",
      answer:
        "Free cancellation is available for most group excursions if you cancel at least 24 hours before the trip. For flights, private tours, special tickets, or cross-border trips, different cancellation rules may apply.",
    },
    {
      category: "refund",
      question: "What is the refund policy?",
      answer:
        "If a refundable booking was paid in advance and cancelled within the allowed cancellation period, the refund will be processed according to the original payment method and provider conditions. Non-refundable costs such as flight tickets, entrance tickets, visas, or third-party fees may not be refundable.",
    },
  ],
  ru: [
    {
      category: "payment",
      question: "Какая у вас политика оплаты?",
      answer:
        "Для большинства групповых экскурсий предоплата не требуется. Вы можете забронировать экскурсию онлайн и оплатить её в день поездки. Для некоторых туров, например авиаперелётов, индивидуальных экскурсий или поездок за границу, может потребоваться предоплата или полная оплата заранее.",
    },
    {
      category: "cancellation",
      question: "Какая у вас политика отмены?",
      answer:
        "Для большинства групповых экскурсий доступна бесплатная отмена при отмене не позднее чем за 24 часа до начала поездки. Для авиаперелётов, индивидуальных туров, специальных билетов или поездок за границу могут действовать отдельные правила отмены.",
    },
    {
      category: "refund",
      question: "Какая у вас политика возврата?",
      answer:
        "Если бронирование было оплачено заранее и отменено в разрешённый срок, возврат производится согласно способу оплаты и условиям поставщика услуги. Невозвратные расходы, такие как авиабилеты, входные билеты, визы или комиссии третьих сторон, могут не возвращаться.",
    },
  ],
  tr: [
    {
      category: "payment",
      question: "Ödeme politikası nedir?",
      answer:
        "Çoğu grup turunda ön ödeme gerekmez. Online rezervasyon yapabilir ve tur günü ödeme yapabilirsiniz. Uçuşlar, özel turlar veya sınır ötesi geziler gibi bazı turlarda ön ödeme ya da tam ödeme gerekebilir.",
    },
    {
      category: "cancellation",
      question: "İptal politikası nedir?",
      answer:
        "Çoğu grup turunda, tur başlangıcından en az 24 saat önce iptal etmeniz halinde ücretsiz iptal mümkündür. Uçuşlar, özel turlar, özel biletler veya sınır ötesi geziler için farklı iptal koşulları geçerli olabilir.",
    },
    {
      category: "refund",
      question: "İade politikası nedir?",
      answer:
        "İade edilebilir bir rezervasyon önceden ödenmiş ve izin verilen iptal süresi içinde iptal edilmişse, iade ilk ödeme yöntemine ve hizmet sağlayıcının koşullarına göre işleme alınır. Uçak bileti, giriş bileti, vize veya üçüncü taraf ücretleri gibi iade edilemeyen masraflar geri ödenmeyebilir.",
    },
  ],
};

const GENERAL_FAQ_CATEGORY_PATTERNS: Record<
  Locale,
  Record<GeneralFaqCategory, RegExp>
> = {
  en: {
    payment:
      /\b(pay|payment|prepayment|advance payment|credit card|currency)\b/i,
    cancellation: /\b(cancel|cancellation)\b/i,
    refund: /\b(refund|refundable|money back)\b/i,
  },
  ru: {
    payment: /(оплат|предоплат|платить|валют)/i,
    cancellation: /(отмен|аннулир)/i,
    refund: /(возврат|вернут.*деньг)/i,
  },
  tr: {
    payment: /(ödeme|ön ödeme|ücret|kredi kart|para birimi)/i,
    cancellation: /(iptal)/i,
    refund: /(iade|geri ödeme)/i,
  },
};

const appendGeneralFaqs = (faq: FaqItem[], locale: Locale): FaqItem[] => {
  const patterns = GENERAL_FAQ_CATEGORY_PATTERNS[locale];
  const existingQuestions = faq.map((item) => item.question);
  const generalFaqs = GENERAL_DESTINATION_FAQS[locale].filter(
    ({ category }) =>
      !existingQuestions.some((question) => patterns[category].test(question)),
  );

  return [
    ...faq,
    ...generalFaqs.map(({ question, answer }) => ({ question, answer })),
  ];
};

export const PAGE_INTROS: Record<PageSlug, Record<Locale, string>> = {
  "sharm-el-sheikh-day-tours": {
    ru: `Экскурсии из Шарм-эль-Шейха — это лучший способ открыть для себя Египет ярко и комфортно. Мы предлагаем морские прогулки по Красному морю, сафари по Синаю, дайвинг и исторические поездки в Каир, Луксор, Иерусалим и Петру.`,
    en: `Sharm El Sheikh Day Tours are the perfect way to explore Egypt in comfort. Enjoy Red Sea cruises, diving, Sinai desert safaris, and cultural trips to Cairo, Luxor, Jerusalem, and Petra.`,
    tr: `Şarm El-Şeyh turları, Mısır’ı konforlu keşfetmenin yoludur. Kızıldeniz tekne turları, dalış, Sina safarileri ve Kahire, Luksor, Kudüs ile Petra gezileri sunuyoruz.`,
  },
  "hurghada-day-tours": {
    ru: `Экскурсии из Хургады — это возможность увидеть Египет во всём многообразии: от коралловых рифов до древних храмов Луксора и Каира. Вас ждут морские прогулки, сафари и VIP-отдых.`,
    en: `Hurghada Day Tours offer a mix of Red Sea relaxation and ancient history. Enjoy snorkeling, desert adventures, and unforgettable trips to Luxor and Cairo.`,
    tr: `Hurghada turları, Kızıldeniz ve Antik Mısır tarihini birleştirir. Şnorkel, çöl maceraları ve Luksor ile Kahire'ye unutulmaz geziler sizi bekliyor.`,
  },
  "cairo-day-tours": {
    ru: `Экскурсии из Каира — это путешествие в сердце истории. Пирамиды Гизы, Сфинкс, музеи и вечерние круизы по Нилу откроют вам настоящий Египет.`,
    en: `Cairo Day Tours take you to the heart of history. The Pyramids of Giza, the Sphinx, museums, and Nile cruises reveal the real Egypt.`,
    tr: `Kahire turları sizi tarihin kalbine götürür. Giza Piramitleri, Sfenks, müzeler ve Nil turları ile gerçek Mısır'ı keşfedin.`,
  },
  "marsa-alam-day-tours": {
    ru: `Экскурсии из Марса-Алама — выбор для любителей нетронутой природы. Регион славится лучшими рифами, морскими коровами и дельфинами.`,
    en: `Marsa Alam Day Tours are for nature lovers. The region is famous for pristine reefs, dugongs, and dolphins in their natural habitat.`,
    tr: `Marsa Alam turları doğa severler içindir. Bölge, el değmemiş resifleri, deniz inekleri ve yunusları ile ünlüdür.`,
  },
};

export const GLOBAL_EXTRA_CONTENT: Record<
  PageSlug,
  Record<Locale, PageExtraContent>
> = {
  "sharm-el-sheikh-day-tours": {
    ru: {
      sections: [
        {
          title: "Почему выбирают наши туры в Шарме?",
          items: [
            "Лицензированные гиды",
            "Страховка включена во все поездки",
            "Трансфер из любого отеля города",
            "Групповые и VIP форматы",
          ],
        },
      ],
      faq: [
        {
          question: "Нужна ли виза для экскурсий из Шарм-эль-Шейха?",
          answer:
            "Для большинства морских прогулок и сафари достаточно бесплатного Синайского штампа. Для поездок в Каир или Луксор требуется полноценная египетская виза ($25), которую мы поможем оформить по приезде или в аэропорту.",
        },
        {
          question: "Безопасно ли ехать в Иерусалим или Петру из Шарма?",
          answer:
            "Да, это одни из самых популярных маршрутов. Мы работаем с официальными перевозчиками, обеспечиваем полное сопровождение на границе и страховку на протяжении всего пути.",
        },
        {
          question: "Как забронировать экскурсию и нужно ли платить заранее?",
          answer:
            "Вы можете забронировать тур онлайн через наш сайт или WhatsApp. Для большинства групповых экскурсий предоплата не требуется — вы платите гиду при посадке в трансфер.",
        },
        {
          question: "Какая погода в Шарм-эль-Шейхе лучше для экскурсий?",
          answer:
            "Морские прогулки актуальны круглый год. Для поездок в Каир или Луксор идеальное время — с октября по май, когда нет сильной жары.",
        },
        {
          question: "Включен ли трансфер из отелей Набк или Хадаба?",
          answer:
            "Да, мы предоставляем бесплатный трансфер из всех районов Шарм-эль-Шейха, включая Набк, Наама Бей и Хадабу.",
        },
      ],
    },
    en: {
      sections: [
        {
          title: "Why book with us in Sharm?",
          items: [
            "Licensed multilingual guides",
            "Insurance included",
            "Door-to-door hotel transfers",
            "Best price guarantee",
          ],
        },
      ],
      faq: [
        {
          question: "Do I need a visa for Sharm El Sheikh excursions?",
          answer:
            "For sea trips and desert safaris, the 'Sinai Only' stamp is free and sufficient. For Cairo or Luxor tours, a standard Egyptian visa is required, which we can assist you with.",
        },
        {
          question: "Is it safe to visit Jerusalem or Petra from Sharm?",
          answer:
            "Yes, these are highly regulated daily tours. We handle all border formalities and provide professional guides and secure transportation.",
        },
        {
          question: "How can I book a tour and what are the payment options?",
          answer:
            "Booking is easy via our website. We accept cash (USD, EUR, GBP, EGP) on the day of the tour or online payments for private VIP bookings.",
        },
        {
          question: "Are airport transfers and hotel pickups included?",
          answer:
            "All our day tours include round-trip transfers from any hotel in Sharm El Sheikh at no extra cost.",
        },
        {
          question: "What is the best time for diving and snorkeling?",
          answer:
            "The Red Sea is great year-round, but water visibility is best from April to October. Wetsuits are provided during winter months.",
        },
      ],
    },
    tr: {
      sections: [
        {
          title: "Neden Şarm El-Şeyh turlarımızı seçmelisiniz?",
          items: [
            "Lisanslı rehberler",
            "Sigortalı turlar",
            "Otelden transfer",
            "Türkçe destek",
          ],
        },
      ],
      faq: [
        {
          question: "Şarm El-Şeyh turları için vize gerekiyor mu?",
          answer:
            "Deniz turları ve safari turları için ücretsiz 'Sinai Only' damgası yeterlidir. Kahire turları için Mısır vizesi gereklidir.",
        },
        {
          question: "Ödeme yöntemleri nelerdir? Ön ödeme gerekiyor mu?",
          answer:
            "Online rezervasyon yapabilirsiniz. Çoğu turumuzda ön ödeme gerekmez, ödemeyi tur günü araçta yapabilirsiniz.",
        },
        {
          question: "Kudüs veya Petra turları güvenli mi?",
          answer:
            "Evet, her gün düzenlenen resmi turlardır. Tüm sınır geçiş işlemleriniz rehberlerimiz tarafından yönetilir.",
        },
        {
          question: "Transferler fiyata dahil mi?",
          answer:
            "Evet, tüm Şarm El-Şeyh otellerinden gidiş-dönüş transfer fiyata dahildir.",
        },
        {
          question: "Çocuklar için indirim var mı?",
          answer:
            "Evet, 6-12 yaş arası çocuklar için %50 indirim uygulanmaktadır, 0-5 yaş arası ise ücretsizdir.",
        },
      ],
    },
  },
  "hurghada-day-tours": {
    ru: {
      sections: [
        {
          title: "Особенности отдыха в Хургаде",
          items: [
            "Лучшие цены на дайвинг",
            "Близость к Луксору (всего 4 часа)",
            "Песчаные острова и лагуны",
          ],
        },
      ],
      faq: [
        {
          question: "Сколько длится дорога из Хургады в Луксор?",
          answer:
            "Поездка в Луксор занимает около 4 часов в одну сторону. Мы выезжаем рано утром на комфортабельных автобусах с кондиционером, чтобы успеть до жары.",
        },
        {
          question: "Можно ли поплавать с дельфинами в открытом море?",
          answer:
            "Да, мы предлагаем экскурсию в 'Дом Дельфинов', где вероятность встретить их в естественной среде составляет более 90%.",
        },
        {
          question: "Включено ли снаряжение для снорклинга в стоимость?",
          answer:
            "Да, маски, ласты и спасательные жилеты всегда включены в стоимость морских прогулок. Наш персонал поможет правильно их подобрать.",
        },
        {
          question: "Какая валюта принимается для оплаты?",
          answer:
            "Вы можете платить в долларах, евро или египетских фунтах. Также возможна оплата переводом на карту.",
        },
        {
          question: "Какие экскурсии из Хургады подходят для детей?",
          answer:
            "Самые популярные семейные туры — это аквариум, прогулка на батискафе (Submarine) и шоу дельфинов.",
        },
      ],
    },
    en: {
      sections: [
        {
          title: "Why visit Hurghada?",
          items: [
            "Best diving spots",
            "Closest access to Luxor",
            "Family-friendly water activities",
          ],
        },
      ],
      faq: [
        {
          question: "How long is the trip from Hurghada to Luxor?",
          answer:
            "The drive takes approximately 4 hours. We use modern, air-conditioned vans and buses to ensure a comfortable journey.",
        },
        {
          question: "Is lunch provided during full-day tours?",
          answer:
            "Yes, all our full-day trips (Luxor, Cairo, and Sea Trips) include a buffet lunch. Drinks are also provided on boat tours.",
        },
        {
          question: "Do you offer private boat rentals or VIP tours?",
          answer:
            "Yes, we specialize in private yacht rentals for families and VIP excursions to Luxor or Cairo with private guides.",
        },
        {
          question: "What is the cancellation policy?",
          answer:
            "You can cancel free of charge up to 24 hours before the tour start time.",
        },
        {
          question: "Can I pay with credit card?",
          answer:
            "Online payments are available via our website, or you can pay cash on the day of the trip.",
        },
      ],
    },
    tr: {
      sections: [
        {
          title: "Hurghada Tur Avantajları",
          items: [
            "En iyi dalış noktaları",
            "Luksor'a en yakın konum",
            "Uygun fiyatlı grup turları",
          ],
        },
      ],
      faq: [
        {
          question: "Hurghada'dan Luksor ne kadar sürüyor?",
          answer:
            "Yolculuk yaklaşık 4 saat sürmektedir. Konforlu ve klimalı araçlarla ulaşım sağlıyoruz.",
        },
        {
          question: "Yunuslarla yüzme turu var mı?",
          answer:
            "Evet, 'Dolphin House' turumuzla yunusları doğal ortamlarında görebilir ve onlarla yüzebilirsiniz.",
        },
        {
          question: "Şnorkel ekipmanları için ek ücret ödenir mi?",
          answer:
            "Hayır, tüm deniz turlarımızda maske, palet ve can yeleği fiyata dahildir.",
        },
        {
          question: "Otel transferi dahil mi?",
          answer:
            "Evet, Hurghada içindeki tüm bölgelerden (Sahl Hasheesh, Makadi dahil) transfer sağlıyoruz.",
        },
        {
          question: "Tur fiyatları ne kadar?",
          answer:
            "Fiyatlarımız tura göre değişmekle birlikte piyasadaki en rekabetçi fiyat garantisini sunuyoruz.",
        },
      ],
    },
  },
  "cairo-day-tours": {
    ru: {
      sections: [
        {
          title: "Ваш идеальный день в Каире",
          items: [
            "Пирамиды без очередей",
            "Трансфер из аэропорта или отеля",
            "Опытные египтологи",
          ],
        },
      ],
      faq: [
        {
          question: "В какое время лучше посещать Пирамиды Гизы?",
          answer:
            "Мы рекомендуем начинать экскурсию в 8:00-9:00 утра. Это позволит избежать полуденного зноя и больших туристических групп.",
        },
        {
          question: "Нужно ли покупать билеты в музеи отдельно?",
          answer:
            "В стоимость наших туров 'все включено' билеты в Каирский музей и на территорию Пирамид уже входят.",
        },
        {
          question: "Можно ли заказать экскурсию в Каир из аэропорта?",
          answer:
            "Да, мы организуем туры для транзитных пассажиров с подачей машины прямо к выходу из терминала аэропорта Каира.",
        },
        {
          question: "Есть ли женские гиды для индивидуальных туров?",
          answer:
            "Да, по запросу мы можем предоставить профессионального гида-женщину для вашего комфорта.",
        },
        {
          question: "Входит ли прогулка по Нилу в программу?",
          answer:
            "В стандартный тур входит обед в ресторане с видом на Нил. По желанию можно добавить прогулку на фелюге (традиционной лодке).",
        },
      ],
    },
    en: {
      sections: [
        {
          title: "Cairo Tour Benefits",
          items: [
            "Skip-the-line pyramid access",
            "Expert Egyptologist guides",
            "Private or group options",
          ],
        },
      ],
      faq: [
        {
          question: "Can we go inside the Great Pyramid?",
          answer:
            "Yes, you can buy an extra ticket at the entrance to explore the interior of the Great Pyramid of Khufu.",
        },
        {
          question: "Is Cairo safe for tourists?",
          answer:
            "Cairo is very safe for international travelers. Our guides stay with you throughout the tour to ensure a smooth experience.",
        },
        {
          question: "What should I wear for a Cairo day tour?",
          answer:
            "We recommend comfortable walking shoes and modest clothing. In summer, light cotton fabrics and hats are essential.",
        },
        {
          question: "Is the Grand Egyptian Museum (GEM) open?",
          answer:
            "The GEM is partially open for limited tours. We can include it in your itinerary depending on current availability.",
        },
        {
          question: "Do you offer airport layover tours?",
          answer:
            "Yes, we specialize in 4 to 8-hour tours starting and ending at Cairo International Airport.",
        },
      ],
    },
    tr: {
      sections: [
        {
          title: "Kahire Turu Detayları",
          items: [
            "Piramitlere hızlı giriş",
            "Uzman rehberler",
            "Havaalanı transferi",
          ],
        },
      ],
      faq: [
        {
          question: "Piramitlerin içine girmek mümkün mü?",
          answer:
            "Evet, piramitlerin içine girmek için giriş kapısında ekstra bilet almanız gerekmektedir.",
        },
        {
          question: "Kahire turu ne kadar sürer?",
          answer:
            "Tam günlük bir Kahire turu genellikle 8-10 saat sürmektedir.",
        },
        {
          question: "Havaalanından karşılama yapıyor musunuz?",
          answer:
            "Evet, Kahire Havalimanı'ndan transfer ve günübirlik turlarımız mevcuttur.",
        },
        {
          question: "Rehberleriniz hangi dilleri konuşuyor?",
          answer:
            "İngilizce, Rusça ve talep üzerine Türkçe konuşan uzman rehberlerimiz bulunmaktadır.",
        },
        {
          question: "Nil Nehri'nde akşam yemeği turu var mı?",
          answer:
            "Evet, canlı müzik ve dans gösterileri eşliğinde Nil Nehri akşam yemeği turları düzenliyoruz.",
        },
      ],
    },
  },
  "marsa-alam-day-tours": {
    ru: {
      sections: [
        {
          title: "Марса-Алам: Рай для дайверов",
          items: [
            "Встреча с морской коровой (Дюгонь)",
            "Бухта Абу Даббаб",
            "Нетронутые кораллы",
          ],
        },
      ],
      faq: [
        {
          question: "Где 100% можно увидеть больших черепах?",
          answer:
            "Бухта Абу Даббаб — лучшее место. Черепахи здесь живут постоянно, их можно увидеть даже на мелководье.",
        },
        {
          question: "Как увидеть морскую корову (дюгоня)?",
          answer:
            "Мы организуем специальные морские прогулки в бухту Марса-Мубарак, где дюгони чаще всего выходят на кормление.",
        },
        {
          question: "Далеко ли ехать из Марса-Алама в Луксор?",
          answer:
            "Дорога занимает около 5 часов. Это длинный путь, поэтому мы используем только индивидуальные трансферы или минивэны повышенной комфортности.",
        },
        {
          question: "Есть ли в Марса-Аламе шопинг и рынки?",
          answer:
            "Марса-Алам — это тихий курорт. За покупками и сувенирами лучше всего отправиться в Порт-Галиб.",
        },
        {
          question: "Подходит ли Марса-Алам для новичков в снорклинге?",
          answer:
            "Да, во многих бухтах пологий песчаный вход, что идеально подходит для детей и тех, кто не умеет плавать.",
        },
      ],
    },
    en: {
      sections: [
        {
          title: "Marsa Alam Highlights",
          items: [
            "Dugong (Sea Cow) spotting",
            "Abu Dabbab turtles",
            "Pristine snorkeling spots",
          ],
        },
      ],
      faq: [
        {
          question: "Where is the best spot to see Dugongs?",
          answer:
            "The best chance to see the Dugong (Sea Cow) is at Marsa Mubarak bay on our specialized boat trips.",
        },
        {
          question: "Can I do a day trip to Luxor from Marsa Alam?",
          answer:
            "Yes, but it's a 5-hour drive each way. We recommend a private tour to make the journey faster and more flexible.",
        },
        {
          question: "Are the reefs in Marsa Alam better than Sharm?",
          answer:
            "Many divers believe so! The reefs here are less crowded and better preserved, with more marine life diversity.",
        },
        {
          question: "Is snorkeling equipment provided?",
          answer:
            "Yes, all our sea excursions include free use of masks, snorkels, and life jackets.",
        },
        {
          question: "Is there an airport in Marsa Alam?",
          answer:
            "Yes, Marsa Alam has its own international airport (RMF), and we provide transfers to all surrounding hotels.",
        },
      ],
    },
    tr: {
      sections: [
        {
          title: "Marsa Alam Keşif Turları",
          items: [
            "Deniz ineği gözlemi",
            "Abu Dabbab kaplumbağaları",
            "Sakin atmosfer",
          ],
        },
      ],
      faq: [
        {
          question: "Deniz kaplumbağalarını nerede görebiliriz?",
          answer:
            "Abu Dabbab koyu, dev deniz kaplumbağalarını görmek için dünyanın en iyi yerlerinden biridir.",
        },
        {
          question: "Marsa Alam'dan Luksor turu yapılıyor mu?",
          answer:
            "Evet, Marsa Alam'dan Luksor'a özel transferli günlük turlar düzenliyoruz.",
        },
        {
          question: "Dalış yapmak için lisans gerekiyor mu?",
          answer:
            "Deneme dalışları (Intro Dive) için lisans gerekmez; profesyonel eğitmenlerimiz size eşlik eder.",
        },
        {
          question: "Bölgede gece hayatı var mı?",
          answer:
            "Marsa Alam daha çok doğa ve huzur odaklıdır, ancak Port Ghalib bölgesinde restoran ve kafeler bulabilirsiniz.",
        },
        {
          question: "Dolphin House turu Marsa Alam'da var mı?",
          answer:
            "Evet, Samadai Resifi (Dolphin House) turu ile onlarca yunusla birlikte yüzme şansınız var.",
        },
      ],
    },
  },
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
  return page[locale as Locale] || page.en;
};

export const getPageExtraContent = ({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}): PageExtraContent => {
  const resolvedLocale = (
    ["en", "ru", "tr"].includes(locale) ? locale : "en"
  ) as Locale;
  const page = GLOBAL_EXTRA_CONTENT[slug as PageSlug];
  const content = page?.[resolvedLocale] || page?.en;

  if (!content) {
    return {
      sections: [],
      faq: appendGeneralFaqs([], resolvedLocale),
    };
  }

  return {
    ...content,
    faq: appendGeneralFaqs(content.faq, resolvedLocale),
  };
};

export const getFaqSchema = (content: PageExtraContent) => {
  if (!content.faq || content.faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
};
