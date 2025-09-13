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
export const Header = () => {
  const t = useTranslations("General.header");

  return (
    <header className="fixed top-0 z-20 h-16 w-full border-b bg-background p-4 text-foreground shadow">
      <nav className="container mx-auto flex items-center justify-between gap-4">
        <Link className="flex items-center gap-2" href="/">
          <img
            className="-mt-1 block w-48 sm:w-56"
            src="/logo.svg"
            alt="Karim Tour"
          />
        </Link>
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
    </header>
  );
};

export default Header;
