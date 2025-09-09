"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { CreditCard, Clock, DollarSign, Headphones, Users, Car, CheckCircle, PhoneCall } from 'lucide-react';

interface ServiceItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

const ServiceItem = ({ icon, title, description }: ServiceItemProps) => (
  <div className="group flex flex-col items-center text-center p-4 md:p-6 lg:p-8  rounded-lg hover: transition-all duration-300 h-full transform hover:-translate-y-1 hover:scale-[1.02] ">
    <div className="w-16   h-16 text-[#ff8106] rounded-full flex items-center justify-center flex-shrink-0 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-#ff8106 leading-tight transition-colors duration-300 group-hover:text-primary">
      {title}
    </h3>
    {description && (
      <p className="text-gray-600 text-sm mt-2">
        {description}
      </p>
    )}
  </div>
);

export default function WeProvide() {
  const t = useTranslations('HomePage.weProvide');
  
  const services = [
    {
      icon: <CreditCard className="w-12 h-12 text-[#ff8106] transition-colors duration-300 group-hover:text-white" />,
      title: t('bookNowPayLater')
    },
    {
      icon: <Clock className="w-12 h-12 text-[#ff8106] transition-colors duration-300 group-hover:text-white" />,
      title: t('freeCancellations')
    },
    {
      icon: <DollarSign className="w-12 h-12 text-[#ff8106] transition-colors duration-300 group-hover:text-white" />,
      title: t('unbeatablePrices')
    },
    {
      icon: <Headphones className="w-12 h-12 text-[#ff8106] transition-colors duration-300 group-hover:text-white" />,
      title: t('expertGuides')
    },
    {
      icon: <Users className="w-12 h-12 text-[#ff8106] transition-colors duration-300 group-hover:text-white" />,
      title: t('privateGroupTours')
    },
    {
      icon: <Car className="w-12 h-12 text-[#ff8106] transition-colors duration-300 group-hover:text-white" />,
      title: t('transferServices')
    },
    {
      icon: <PhoneCall className="w-12 h-12 text-[#ff8106] transition-colors duration-300 group-hover:text-white" />,
      title: t('quickBooking')
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-[#ff8106] transition-colors duration-300 group-hover:text-white" />,
      title: t('transparentPricing')
    }
  ];

  
  return (
    <section className="py-14 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-2xl lg:text-3xl md:text-3xl font-bold mb-8 text-center">{t('sectionTitle')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 ">
          {services.map((service, index) => (
            <ServiceItem
              key={index}
              icon={service.icon}
              title={service.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}