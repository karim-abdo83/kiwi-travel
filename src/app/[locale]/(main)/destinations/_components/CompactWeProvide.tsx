"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { CreditCard, Clock, DollarSign, Headphones, Users, Car, CheckCircle, PhoneCall } from 'lucide-react';

const CompactServiceItem = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded transition-colors">
    <div className="text-[#ff8106] flex-shrink-0">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    </div>
    <span className="text-sm text-gray-700">
      {title}
    </span>
  </div>    
);

export default function CompactWeProvide() {
  const t = useTranslations('HomePage.weProvide');

  const services = [
    { icon: <CreditCard />, title: t('bookNowPayLater') },
    { icon: <Clock />, title: t('freeCancellations') },
    { icon: <DollarSign />, title: t('unbeatablePrices') },
    { icon: <Headphones />, title: t('expertGuides') },
    { icon: <Users />, title: t('privateGroupTours') },
    { icon: <Car />, title: t('transferServices') },
    { icon: <PhoneCall />, title: t('quickBooking') },
    { icon: <CheckCircle />, title: t('transparentPricing') }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-2">
      {services.map((service, index) => (
        <CompactServiceItem
          key={index}
          icon={service.icon}
          title={service.title}
        />
      ))}
    </div>
  );
}
