"use client";

import { cn } from "@/lib/utils";
import { getTripBadgeLabel } from "@/lib/trip-badge-labels";
import type { TripBadge } from "@/validators/trip-schema";
import { useLocale } from "next-intl";

const badgeStyles: Record<TripBadge, string> = {
  Popular: "bg-blue-600",
  "Best Seller": "bg-orange-500",
  VIP: "bg-violet-600",
  New: "bg-emerald-600",
  Sale: "bg-red-600",
  "Wow Price": "bg-pink-600",
};

interface TripCardBadgeProps {
  badge: TripBadge | null;
  className?: string;
}

export function TripCardBadge({ badge, className }: TripCardBadgeProps) {
  const locale = useLocale();

  if (!badge) return null;

  return (
    <span
      className={cn(
        "absolute left-3 top-3 z-10 rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow-sm",
        badgeStyles[badge],
        className,
      )}
    >
      {getTripBadgeLabel(badge, locale)}
    </span>
  );
}
