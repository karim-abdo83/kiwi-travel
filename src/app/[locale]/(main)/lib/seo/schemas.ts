export function cleanSchema(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

//breadcrumbSchema
export function generateBreadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

//destinationSchema
export function generateDestinationSchema({
  destination,
  locale,
  baseUrl,
}: any) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",

    name: destination.name,
    description: destination.description || "",
    image: destination.image,

    url: `${baseUrl}/${locale}/destinations/${destination.slug}`,

    hasPart: destination.trips.map((trip: any) => ({
      "@type": "TouristTrip",
      name: trip.title,
      url: `${baseUrl}/${locale}/trips/${trip.slug}`,
    })),
  };
}

//tripSchema
export function generateTripSchema({ trip, locale, baseUrl }: any) {
  const avg =
    trip.reviews.length > 0
      ? trip.reviews.reduce((a: number, b: any) => a + b.ratingValue, 0) /
        trip.reviews.length
      : null;

  return {
    "@context": "https://schema.org",
    "@type": ["Product", "TouristTrip"],

    name: trip.title,
    description: trip.description,
    image: trip.image,

    url: `${baseUrl}/${locale}/trips/${trip.slug}`,

    brand: {
      "@type": "Organization",
      name: "Karim Tour",
    },

    offers: {
      "@type": "Offer",
      price: (trip.price / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },

    aggregateRating: avg
      ? {
          "@type": "AggregateRating",
          ratingValue: avg.toFixed(1),
          reviewCount: trip.reviews.length,
        }
      : undefined,
  };
}


//listSchema
export function generateListSchema({
  destinations,
  locale,
  baseUrl,
}: any) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",

    itemListElement: destinations.map((d: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      name: d.name,
      url: `${baseUrl}/${locale}/destinations/${d.slug}`,
    })),
  };
}