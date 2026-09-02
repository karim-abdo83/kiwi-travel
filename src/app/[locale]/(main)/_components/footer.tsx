"use client";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Instagram,
  Facebook,
  MessageSquare,
  MessageCircle,
  Send,
  Phone,
  FacebookIcon,
  X,
} from "lucide-react";
import { TrackedContactLink } from "@/components/tracked-contact-link";
interface Social {
  icon: React.ReactNode;
  link: string;
  name: string;
}

export default function Footer() {
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations("General.footer");

  const phones = ["+201003637624", "+905352699881", "+79645056936"];

  const socials: Social[] = [
    {
      icon: <Instagram className="h-5 w-5" />,
      link: "https://www.instagram.com/kiwitraveleg?igsh=MXJzZjFwY2Fzc2E2Zw==",
      name: "Instagram",
    },
    {
      icon: <FacebookIcon className="h-5 w-5" />,
      link: "https://www.facebook.com/share/16NjtcXwqN/?mibextid=wwXIfr",
      name: "Facebook",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      link: "https://vk.com/kiwitravelseg",
      name: "VK",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      link: "https://wa.me/79645056936",
      name: "WhatsApp",
    },
    {
      icon: <Send className="h-5 w-5" />,
      link: "https://t.me/karimtor_kiwitravel",
      name: "Telegram",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      link: "https://invite.viber.com/?g2=AQA0x%2BECmdFOrlSTvNRusTVCZ9u6iaAtDGMI1Ok8C480GH8eKU2hM9%2F8J8kWlMHp",
      name: "Viber",
    },
  ];

  return (
    <footer className="bg-[#0b3275] px-4 py-8 text-primary-foreground lg:px-6">
      <div className="container mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <Image
                className="-mt-2 h-auto w-48"
                src="/logo-footer.svg"
                alt="Karim Tour"
                width={192}
                height={40}
                priority
              />
            </Link>
            <p className="mt-2 text-sm">{t("discoverTheWorld")}</p>

            {/* Contact information added here */}
            <div className="mt-4 grid gap-2">
              <h3 className="text-sm font-semibold">{t("contactUs")}</h3>
              <ul>
                {phones.map((phone) => (
                  <li key={phone}>
                    <a
                      className="text-sm text-[#ff8106] hover:underline"
                      href={`tel:${phone}`}
                    >
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Image
                  src="/registration-footer.jpg"
                  alt="Footer image"
                  width={500}
                  height={250}
                  className="h-auto w-auto max-w-[170px] cursor-pointer rounded-md shadow-md transition-opacity hover:opacity-80"
                  onClick={() => setShowModal(true)}
                  priority
                />

                {showModal && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setShowModal(false)}
                  >
                    <div
                      className="relative max-h-[95vh] w-full max-w-6xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="absolute -top-12 right-0 rounded-full bg-black/50 p-1 text-white hover:text-gray-300"
                        onClick={() => setShowModal(false)}
                        aria-label="Close"
                      >
                        <X className="h-8 w-8" />
                      </button>
                      <div className="flex h-full w-full items-center justify-center">
                        <Image
                          src="/registration-certificate.jpg"
                          alt="Enlarged footer image"
                          width={2000}
                          height={1000}
                          className="max-h-[90vh] max-w-full object-contain"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              {t("quickLinksTitle")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:underline">
                  {t("quickLinks.home")}
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:underline">
                  {t("quickLinks.destinations")}
                </Link>
              </li>
              <li>
                <Link href="/trips" className="hover:underline">
                  {t("quickLinks.trips")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/sahl-hasheesh-excursions"
                  className="hover:underline"
                >
                  {t("quickLinks.article1")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/el-gouna-excursions-guide"
                  className="hover:underline"
                >
                  {t("quickLinks.article2")}
                </Link>
              </li>

              <li>
                <Link
                  href="/blog/sharm-airport-transfer"
                  className="hover:underline"
                >
                  {t("quickLinks.article3")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("supportTitle")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faqs" className="hover:underline">
                  {t("supportLinks.faqs")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  {t("supportLinks.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  {t("supportLinks.termsOfService")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("followUsTitle")}</h3>
            <div className="grid grid-cols-2 gap-4">
              {socials.map((social) => {
                const channel =
                  social.name === "WhatsApp"
                    ? "whatsapp"
                    : social.name === "Telegram"
                      ? "telegram"
                      : null;
                const content = (
                  <>
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-[#0b3275] transition-colors group-hover:bg-transparent group-hover:text-[#ff8106]">
                      {social.icon}
                    </span>
                    <span className="whitespace-nowrap text-sm transition-colors group-hover:text-[#ff8106]">
                      {social.name}
                    </span>
                  </>
                );
                return channel ? (
                  <TrackedContactLink
                    key={social.name}
                    channel={channel}
                    ctaLocation="footer"
                    href={social.link}
                    className="group flex items-center space-x-2 rounded-lg p-2 transition-colors"
                  >
                    {content}
                  </TrackedContactLink>
                ) : (
                  <a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 rounded-lg p-2 transition-colors"
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-foreground/20 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Karim Tour. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
