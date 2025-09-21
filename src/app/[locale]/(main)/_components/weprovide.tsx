"use client";

import React  from 'react';
import { useTranslations } from 'next-intl';
import { CreditCard, Clock, DollarSign, Headphones, Users, Car, CheckCircle, PhoneCall } from 'lucide-react';

interface ServiceItemProps {
  icon: React.ReactNode;
  title: string;
}

const ServiceItem = ({ icon, title }: ServiceItemProps) => (
  <div className="flex items-center gap-2 lg:gap-3 p-2 lg:py-6">
    <div className="text-[#ff8106] flex-shrink-0 bg-orange-50 p-2 rounded-full">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}
    </div>
    <span className="text-sm font-medium text-gray-800">
      {title}
    </span>
  </div>
);

interface WeProvideProps {
  className?: string;
}

export default function WeProvide({ className = '' }: WeProvideProps) {
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
    <div className={`${className} p-4 bg-white`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2  rounded-lg border border-gray-200 shadow-sm mt-16">
        {services.map((service, index) => (
          <div key={index} className="hover:bg-orange-50 rounded-md transition-colors">
            <ServiceItem
              icon={service.icon}
              title={service.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}