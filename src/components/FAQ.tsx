'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { HomestaySettings } from '@/types';

interface FAQProps {
  settings: HomestaySettings;
}

export default function FAQ({ settings }: FAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const FAQ_LIST = [
    {
      q: 'Bagaimanakah cara membuat tempahan di web ini?',
      a: 'Sangat mudah! Pilih tarikh check-in & check-out di kalendar, masukkan nama dan nombor WhatsApp (tanpa perlu mendaftar akaun), imbas kod DuitNow QR dan muat naik resit bayaran. Butiran akan terus dihantar kepada pengurus melalui WhatsApp.',
    },
    {
      q: 'Pukul berapa waktu Check-in dan Check-out?',
      a: `Waktu Check-in rasmi adalah pada atau selepas jam ${settings.check_in_time}, dan waktu Check-out adalah sebelum jam ${settings.check_out_time}. Permintaan awal atau lewat tertakluk kepada kekosongan jadual pembersihan pada hari berkenaan.`,
    },
    {
      q: 'Bila deposit keselamatan akan dikembalikan?',
      a: `Deposit keselamatan (RM ${settings.security_deposit}) akan dipindahkan semula terus ke akaun bank anda dalam tempoh 24 jam selepas waktu check-out selepas pemeriksaan kebersihan & fasiliti selesai.`,
    },
    {
      q: 'Adakah kolam renang dikongsi dengan orang lain?',
      a: 'Tidak! Kolam renang adalah 100% persendirian (private) untuk anda dan keluarga anda sahaja sepanjang tempoh penginapan.',
    },
    {
      q: 'Berapakah kapasiti maksimum tetamu yang dibenarkan?',
      a: `Kapasiti optimum dan selesa adalah sehingga ${settings.max_guests} orang tetamu termasuk kanak-kanak. Sekiranya ada pertambahan, sila maklumkan kepada pihak pengurus terlebih dahulu.`,
    },
    {
      q: 'Bolehkah membuat aktiviti BBQ?',
      a: 'Ya, set pit BBQ lengkap disediakan percuma di tepi kolam renang. Anda hanya perlu membawa bahan makanan dan arang sendiri.',
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            Soalan Lazim
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Semua Yang Perlu Anda Tahu
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Jawapan ringkas dan jelas bagi soalan lazim tetamu sebelum membuat tempahan.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_LIST.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all bg-slate-50"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:bg-slate-100 transition"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-teal-700 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
