type CountryNames = {
  nameEn: string;
  nameRu: string;
  nameTr: string;
};

const slugifyCountryName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getCountrySeoKey = (country: CountryNames) => {
  const names = [country.nameEn, country.nameRu, country.nameTr].map(
    slugifyCountryName,
  );

  if (names.some((name) => ["egypt", "egipet", "misir"].includes(name))) {
    return "egypt";
  }

  if (names.some((name) => ["turkey", "turkiye", "turtsiya"].includes(name))) {
    return "turkey";
  }

  return null;
};

export const getCountrySlug = (country: CountryNames) =>
  getCountrySeoKey(country) ?? slugifyCountryName(country.nameEn);

export const findCountryBySlug = <T extends CountryNames>(
  countries: T[],
  slug: string,
) => {
  const normalizedSlug = slugifyCountryName(slug);

  return countries.find(
    (country) =>
      getCountrySlug(country) === normalizedSlug ||
      [country.nameEn, country.nameRu, country.nameTr]
        .map(slugifyCountryName)
        .includes(normalizedSlug),
  );
};
