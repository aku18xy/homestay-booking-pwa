'use client';

import React from 'react';
import { MapPin, Navigation, ExternalLink, Clock, Car } from 'lucide-react';
import { HomestaySettings } from '@/types';

interface LocationSectionProps {
  settings: HomestaySettings;
}

export default function LocationSection({ settings }: LocationSectionProps) {
  const NEARBY_PLACES = [
    { name: 'Zon Industri & Pelabuhan Westport', time: '5 - 8 minit' },
    { name: 'Laguna Park & Jeti Memancing Pulau Indah', time: '4 minit' },
    { name: 'Lebuhraya SKVE & KESAS', time: '8 minit' },
    { name: 'Restoran Ikan Bakar & Kedai Runcit Kg Telok Nipah', time: '2 minit' },
  ];

  return (
    <section id="lokasi" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                Lokasi Strategik & Mudah Akses
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Lokasi Menyenangkan Perjalanan Anda
              </h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
                Terletak di kawasan perumahan berpagar yang tenang, selamat, dan bebas daripada kesesakan lalu lintas bandar.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
              <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Alamat Penuh</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{settings.address}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Kemudahan Berdekatan
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {NEARBY_PLACES.map((place, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <span className="text-slate-700 font-medium">{place.name}</span>
                    <span className="text-teal-700 font-bold flex items-center gap-1 flex-shrink-0 ml-2">
                      <Car className="w-3.5 h-3.5" /> {place.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Map / Waze Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={settings.waze_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-sky-600 hover:bg-sky-700 shadow-md transition"
              >
                <Navigation className="w-4 h-4" />
                Pandu Menggunakan Waze
              </a>
              <a
                href={settings.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition"
              >
                <ExternalLink className="w-4 h-4" />
                Buka di Google Maps
              </a>
            </div>
          </div>

          {/* Map Visual Preview Frame */}
          <div className="lg:col-span-7 bg-white p-3 rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden relative bg-slate-100 flex items-center justify-center">
              <iframe
                title="Peta Lokasi Homestay"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15937.199343360877!2d101.782!3d3.011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cdcd7b59e66167%3A0x6b44a2c51086a439!2sKajang%2C%20Selangor!5e0!3m2!1sen!2smy!4v1680000000000!5m2!1sen!2smy"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
