'use client';

import React from 'react';
import {
  Waves,
  Wind,
  Wifi,
  Tv,
  Flame,
  Droplets,
  UtensilsCrossed,
  Car,
  Shirt,
  Coffee,
  Shield,
  Sparkles,
  TreePine,
  Bath,
} from 'lucide-react';
import { AmenityItem } from '@/types';

interface AmenitiesProps {
  amenities: AmenityItem[];
  unitName: string;
}

export default function Amenities({ amenities, unitName }: AmenitiesProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Waves':
        return Waves;
      case 'Wind':
        return Wind;
      case 'Wifi':
        return Wifi;
      case 'Tv':
        return Tv;
      case 'Flame':
        return Flame;
      case 'Droplets':
        return Droplets;
      case 'UtensilsCrossed':
        return UtensilsCrossed;
      case 'Car':
        return Car;
      case 'Shirt':
        return Shirt;
      case 'Coffee':
        return Coffee;
      case 'Shield':
        return Shield;
      case 'TreePine':
        return TreePine;
      case 'Bath':
        return Bath;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="kemudahan" className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Kemudahan Disediakan
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Fasiliti Khusus: {unitName}
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Semua kemudahan di bawah adalah khas untuk keselesaan anda sepanjang penginapan di unit ini.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {amenities.map((item, idx) => {
            const Icon = getIcon(item.iconName);
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-teal-50 group-hover:bg-teal-600 text-teal-700 group-hover:text-white flex items-center justify-center transition-colors mb-3.5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{item.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
