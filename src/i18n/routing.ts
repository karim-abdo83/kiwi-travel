import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru", "tr"],
  defaultLocale: "en",
  alternateLinks: false,
})

export const {
  Link,
  redirect,
  usePathname,
  useRouter,
} = createNavigation(routing);
