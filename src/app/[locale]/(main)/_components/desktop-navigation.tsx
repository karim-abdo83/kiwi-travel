"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/routing";
import { getCountrySlug } from "@/lib/country-slug";
import { localeAttributeFactory } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const navigationButtonClass =
  "h-9 px-3 text-sm font-medium data-[state=open]:bg-primary/90";

export const DesktopNavigation = () => {
  const t = useTranslations("General.header");
  const locale = useLocale();
  const localeAttribute = localeAttributeFactory(locale);
  const countryLabel =
    locale === "ru" ? "Страны" : locale === "tr" ? "Ülkeler" : "Countries";

  const { data: countries } = api.country.list.useQuery();
  const { data: destinations } = api.destination.list.useQuery({});

  return (
    <div className="hidden items-center gap-2 md:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={navigationButtonClass}>
            {countryLabel}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="max-h-80 min-w-56 overflow-y-auto"
        >
          {countries?.map((country) => (
            <DropdownMenuItem key={country.id} asChild>
              <Link href={`/destinations/country/${getCountrySlug(country)}`}>
                {localeAttribute(country, "name")}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={navigationButtonClass}>
            {t("destination")}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="max-h-80 min-w-64 overflow-y-auto"
        >
          {destinations?.map((destination) => (
            <DropdownMenuItem key={destination.id} asChild>
              <Link href={`/destinations/${destination.slug}`}>
                {localeAttribute(destination, "name")}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button className={navigationButtonClass} asChild>
        <Link href="/trips">{t("trip")}</Link>
      </Button>

      <Button className={navigationButtonClass} asChild>
        <Link href="/blog">{t("blog")}</Link>
      </Button>
    </div>
  );
};

export default DesktopNavigation;
