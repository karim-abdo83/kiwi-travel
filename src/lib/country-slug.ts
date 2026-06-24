type CountryWithNames = {
  nameEn: string;
  nameRu: string;
  nameTr: string;
};

export const getCountrySlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getCountrySeoKey = (country: CountryWithNames) => {
  const names = [country.nameEn, country.nameRu, country.nameTr].map(
    getCountrySlug,
  );

  if (names.some((name) => ["egypt", "egipet", "misir"].includes(name))) {
    return "egypt";
  }

  if (names.some((name) => ["turkey", "turkiye", "turtsiya"].includes(name))) {
    return "turkey";
  }

  return null;
};

export const findCountryBySlug = <T extends CountryWithNames>(
  countries: T[],
  slug: string,
) => {
  const normalizedSlug = getCountrySlug(slug);

  return countries.find((country) => {
    const canonicalSlug = getCountrySlug(country.nameEn);
    const seoKey = getCountrySeoKey(country);

    return canonicalSlug === normalizedSlug || seoKey === normalizedSlug;
  });
};
