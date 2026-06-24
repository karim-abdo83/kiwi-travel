"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Link } from "@/i18n/routing";
import { getCountrySlug } from "@/lib/country-slug";
import { localeAttributeFactory } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  SignOutButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import {
  LogOut,
  Menu,
  MessageCircle,
  Phone,
  Send,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import LanguageToggle from "./language-toggle";

export const DrawerButton = () => {
  const [open, setOpen] = useState(false);
  const { openUserProfile } = useClerk();

  const t = useTranslations("General.header");
  const footerT = useTranslations("General.footer");
  const locale = useLocale();
  const localeAttribute = localeAttributeFactory(locale);
  const menuLabels = {
    en: {
      country: "Country",
      destinations: "Destinations",
      loading: "Loading...",
      noCountries: "No countries available",
      noDestinations: "No destinations available",
      closeMenu: "Close menu",
    },
    ru: {
      country: "Страна",
      destinations: "Направления",
      loading: "Загрузка...",
      noCountries: "Нет доступных стран",
      noDestinations: "Нет доступных направлений",
      closeMenu: "Закрыть меню",
    },
    tr: {
      country: "Ülke",
      destinations: "Destinasyonlar",
      loading: "Yükleniyor...",
      noCountries: "Kullanılabilir ülke yok",
      noDestinations: "Kullanılabilir destinasyon yok",
      closeMenu: "Menüyü kapat",
    },
  }[locale as "en" | "ru" | "tr"];

  const { data: countries, isLoading: isCountriesLoading } =
    api.country.list.useQuery(undefined, { enabled: open });
  const { data: destinations, isLoading: isDestinationsLoading } =
    api.destination.list.useQuery({}, { enabled: open });

  const { user } = useUser();

  const isAdmin = !!user?.publicMetadata?.isAdmin;
  const closeDrawer = () => setOpen(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button className="md:hidden" variant="outline" size="icon">
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-80 max-w-[calc(100vw-1rem)]">
        <DrawerHeader className="border-b px-4 py-3">
          <DrawerTitle className="flex items-center justify-between gap-3">
            <Link
              href="/"
              onClick={closeDrawer}
              className="flex min-w-0 items-center"
            >
              <Image
                className="h-auto w-44"
                src="/logo.svg"
                alt="Karim Tour"
                width={176}
                height={38}
                priority
              />
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <LanguageToggle />
              <Button
                variant="outline"
                size="icon"
                onClick={closeDrawer}
                aria-label={menuLabels.closeMenu}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            {t("sidenavDescription")}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="country">
              <AccordionTrigger className="py-3 text-base font-semibold hover:no-underline">
                {menuLabels.country}
              </AccordionTrigger>
              <AccordionContent className="grid gap-1 pb-3">
                {isCountriesLoading ? (
                  <span className="rounded-md px-3 py-2 text-sm text-muted-foreground">
                    {menuLabels.loading}
                  </span>
                ) : countries && countries.length > 0 ? (
                  countries.map((country) => (
                    <Link
                      key={country.id}
                      href={`/destinations/country/${getCountrySlug(country.nameEn)}`}
                      onClick={closeDrawer}
                      className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                    >
                      {localeAttribute(country, "name")}
                    </Link>
                  ))
                ) : (
                  <span className="rounded-md px-3 py-2 text-sm text-muted-foreground">
                    {menuLabels.noCountries}
                  </span>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="destinations">
              <AccordionTrigger className="py-3 text-base font-semibold hover:no-underline">
                {menuLabels.destinations}
              </AccordionTrigger>
              <AccordionContent className="grid gap-1 pb-3">
                {isDestinationsLoading ? (
                  <span className="rounded-md px-3 py-2 text-sm text-muted-foreground">
                    {menuLabels.loading}
                  </span>
                ) : destinations && destinations.length > 0 ? (
                  destinations.map((destination) => (
                    <Link
                      key={destination.id}
                      href={`/destinations/${destination.slug}`}
                      onClick={closeDrawer}
                      className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                    >
                      {localeAttribute(destination, "name")}
                    </Link>
                  ))
                ) : (
                  <span className="rounded-md px-3 py-2 text-sm text-muted-foreground">
                    {menuLabels.noDestinations}
                  </span>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <nav className="grid gap-1 border-b py-3">
            <Link
              href="/trips"
              onClick={closeDrawer}
              className="rounded-md px-3 py-2 text-base font-semibold transition-colors hover:bg-muted hover:text-primary"
            >
              {t("trip")}
            </Link>
            <Link
              href="/blog"
              onClick={closeDrawer}
              className="rounded-md px-3 py-2 text-base font-semibold transition-colors hover:bg-muted hover:text-primary"
            >
              {t("blog")}
            </Link>
          </nav>

          <div className="grid gap-2 border-b py-3">
            {isAdmin && (
              <Link onClick={closeDrawer} href="/dashboard">
                <Button className="w-full">{t("dashboard")}</Button>
              </Link>
            )}
            <SignedIn>
              <Link onClick={closeDrawer} href="/bookings">
                <Button className="w-full">{t("bookings")}</Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button
                  id="sign-in-button-2"
                  className="w-full"
                  variant="outline"
                >
                  {t("signIn")}
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button id="sign-up-button-2" className="w-full">
                  {t("signUp")}
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button
                onClick={() => {
                  closeDrawer();
                  openUserProfile();
                }}
              >
                <User /> {t("openProfile")}
              </Button>
              <SignOutButton>
                <Button onClick={closeDrawer} variant="outline">
                  <LogOut />
                  {t("signOut")}
                </Button>
              </SignOutButton>
            </SignedIn>
          </div>

          <section className="grid gap-2 border-b py-4">
            <h3 className="px-3 text-sm font-semibold text-muted-foreground">
              {footerT("contactUs")}
            </h3>
            <a
              href="https://wa.me/79645056936"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              WhatsApp
            </a>
            <a
              href="https://t.me/karimtor_kiwitravel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
            >
              <Send className="h-4 w-4 text-sky-500" />
              Telegram
            </a>
            <a
              href="tel:+79645056936"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
            >
              <Phone className="h-4 w-4 text-primary" />
              +79645056936
            </a>
          </section>

          <nav className="grid gap-1 py-3">
            <Link
              href="/faqs"
              onClick={closeDrawer}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
            >
              {footerT("supportLinks.faqs")}
            </Link>
            <Link
              href="/privacy"
              onClick={closeDrawer}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
            >
              {footerT("supportLinks.privacyPolicy")}
            </Link>
            <Link
              href="/terms"
              onClick={closeDrawer}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
            >
              {footerT("supportLinks.termsOfService")}
            </Link>
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerButton;
