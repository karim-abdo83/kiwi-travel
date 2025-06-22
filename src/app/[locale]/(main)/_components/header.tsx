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
;

export const Header = () => {
  const t = useTranslations("General.header");

  return (
    <header className="z-20 fixed w-full top-0 h-16 border-b shadow bg-background text-foreground p-4">
      <nav className="container flex items-center justify-between gap-4 mx-auto">
        <Link className="flex gap-2 items-center" href="/">
          <img className="-mt-1 sm:w-56 w-48 block" src="/logo.svg" alt="Karim Tour" />
        </Link>
        <div className="md:flex hidden gap-4">
          <SignedOut>
            <SignInButton>
              <Button variant="outline">
                {t("signIn")}
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button>
                {t("signUp")}
              </Button>
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
