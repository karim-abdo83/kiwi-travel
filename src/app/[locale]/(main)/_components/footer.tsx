"use client";
import { useState } from 'react';
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Instagram, Facebook, MessageSquare, MessageCircle, Send, Phone, FacebookIcon, X } from "lucide-react";
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
      icon: <Instagram className="w-5 h-5" />,
      link: "https://www.instagram.com/kiwitraveleg?igsh=MXJzZjFwY2Fzc2E2Zw==",
      name: "Instagram"
    },
    {
      icon: <FacebookIcon className="w-5 h-5" />,
      link: "https://www.facebook.com/share/16NjtcXwqN/?mibextid=wwXIfr",
      name: "Facebook"
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      link: "https://vk.com/kiwitravelseg",
      name: "VK"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      link: "https://wa.me/79645056936",
      name: "WhatsApp"
    },
    {
      icon: <Send className="w-5 h-5" />,
      link: "https://t.me/karimtours",
      name: "Telegram"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      link: "https://invite.viber.com/?g2=AQA0x%2BECmdFOrlSTvNRusTVCZ9u6iaAtDGMI1Ok8C480GH8eKU2hM9%2F8J8kWlMHp",
      name: "Viber"
    },
  ];

  return (
    <footer className="bg-[#0b3275] py-8 text-primary-foreground px-4 lg:px-6">
      <div className="container mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <Image className="-mt-2 w-48 h-auto" src="/logo-footer.svg" alt="Karim Tour" width={192} height={40} priority />
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
                  src='/registration-footer.jpg'
                  alt="Footer image" 
                  width={500} 
                  height={250} 
                  className="w-auto h-auto max-w-[170px] cursor-pointer hover:opacity-80 transition-opacity rounded-md shadow-md"
                  onClick={() => setShowModal(true)}
                  priority
                />
                
                {showModal && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="relative max-w-6xl w-full max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-black/50 rounded-full p-1"
                        onClick={() => setShowModal(false)}
                        aria-label="Close"
                      >
                        <X className="w-8 h-8" />
                      </button>
                      <div className="w-full h-full flex items-center justify-center">
                        <Image 
                          src='/registration-certificate.jpg' 
                          alt="Enlarged footer image" 
                          width={2000}
                          height={1000}
                          className="max-w-full max-h-[90vh] object-contain"
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
                <Link href="/blog/sahl-hasheesh-excursions" className="hover:underline">
                  {t("quickLinks.article1")}
                </Link>
              </li>
               <li>
                <Link href="/blog/el-gouna-excursions-guide" className="hover:underline">
                  {t("quickLinks.article2")}
                </Link>
              </li>
              
               <li>
                <Link href="/blog/sharm-airport-transfer" className="hover:underline">
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
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 p-2 rounded-lg transition-colors"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-[#0b3275] flex-shrink-0 group-hover:bg-transparent group-hover:text-[#ff8106] transition-colors">
                    {social.icon}
                  </span>
                  <span className="text-sm whitespace-nowrap group-hover:text-[#ff8106] transition-colors">{social.name}</span>
                </a>
              ))}
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
