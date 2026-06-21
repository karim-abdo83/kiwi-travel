import { cn } from "@/lib/utils";

interface TripPriceProps {
  salePrice: number;
  originalPrice?: number | null;
  currency: string;
  className?: string;
  align?: "start" | "end";
}

const formatPrice = (price: number) =>
  Number.isInteger(price) ? price.toString() : price.toFixed(2);

export function TripPrice({
  salePrice,
  originalPrice,
  currency,
  className,
  align = "start",
}: TripPriceProps) {
  const hasDiscount =
    originalPrice !== null &&
    originalPrice !== undefined &&
    originalPrice > salePrice;

  if (!hasDiscount) {
    return (
      <span className={cn("text-lg font-bold", className)}>
        {currency}
        {formatPrice(salePrice)}
      </span>
    );
  }

  const discountPercentage = Math.round(
    ((originalPrice - salePrice) / originalPrice) * 100,
  );

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1",
        align === "end" && "justify-end text-right",
        className,
      )}
    >
      <span className="text-sm text-gray-500 line-through">
        {currency}
        {formatPrice(originalPrice)}
      </span>
      <span className="text-lg font-bold text-orange-500">
        {currency}
        {formatPrice(salePrice)}
      </span>
      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
        -{discountPercentage}%
      </span>
    </div>
  );
}
