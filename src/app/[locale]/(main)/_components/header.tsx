import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { useTranslations } from "next-intl";
import { Suspense } from "react";
import DashboardButton from "./dashboard-button";
import DrawerButton from "./drawer-button";
import LanguageToggle from "./language-toggle";
import Image from "next/image";
export const Header = () => {
  const t = useTranslations("General.header");

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 w-full border-b bg-background text-foreground shadow">
      <div className="relative h-full w-full px-4">
        <nav className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between">
          <Link className="flex items-center gap-2" href="/">
            <Image
              className="-mt-1 block h-auto w-48 sm:w-56"
              src="/logo.svg"
              alt="Karim Tour"
              width={224}
              height={48}
              priority
            />
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/destinations"
              className="rounded-md border border-primary/25 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {t("destination")}
            </Link>

            <Link
              href="/trips"
              className="rounded-md border border-primary/25 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {t("trip")}
            </Link>
            <Link
              href="/blog"
              className="rounded-md border border-primary/25 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {t("blog")}
            </Link>
          </div>
          <div className="hidden gap-4 md:flex">
            <SignedOut>
              <SignInButton>
                <Button id="sign-in-button-1" variant="outline">
                  {t("signIn")}
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button id="sign-up-button-1">{t("signUp")}</Button>
              </SignUpButton>
            </SignedOut>
            <LanguageToggle />
            <Suspense fallback={<Button disabled>Loading...</Button>}>
              <DashboardButton />
            </Suspense>
            <SignedIn>
              <Link href="/bookings">
                <Button>{t("bookings")}</Button>
              </Link>
              <UserButton />
            </SignedIn>
          </div>
          <DrawerButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
