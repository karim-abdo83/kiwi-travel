import type { TripBadge } from "@/validators/trip-schema";

const russianBadgeLabels: Record<TripBadge, string> = {
  Popular: "Популярный",
  "Best Seller": "Хит продаж",
  VIP: "VIP",
  New: "Новинка",
};

export function getTripBadgeLabel(badge: TripBadge, locale: string) {
  return locale === "ru" ? russianBadgeLabels[badge] : badge;
}

export function getNoTripBadgeLabel(locale: string) {
  return locale === "ru" ? "Без бейджа" : "None";
}
