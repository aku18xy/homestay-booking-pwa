'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Khairul Anuar & Keluarga',
    date: 'Oktober 2026',
    rating: 5,
    comment:
      'Kolam renang memang bersih dan luas, anak-anak mandi sampai puas! Rumah sangat kemas, aircond semua bilik sejuk beku. Tempah guna web ni senang betul, tak payah pening daftar akaun.',
  },
  {
    name: 'Nurul Huda',
    date: 'September 2026',
    rating: 5,
    comment:
      'Fasiliti memasak lengkap sangat. Kami buat BBQ tepi kolam waktu malam memang best. Owner sangat peramah dan respon pantas di WhatsApp.',
  },
  {
    name: 'Dr. Zulkifli Rahman',
    date: 'Ogos 2026',
    rating: 5,
    comment:
      'Tempat yang sangat tenang untuk rehatkan fikiran bersama famili besar. Parkir boleh muat 4 biji kereta selesa. Sistem bayaran DuitNow terus sangat memudahkan.',
  },
];

export default function Reviews() {
  return (
    <section id="ulasan" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Penilaian Tetamu 4.9 / 5.0
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Apa Kata Tetamu Kami?
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Kepuasan dan keselesaan anda adalah keutamaan kami sepanjang penginapan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-slate-200 absolute top-5 right-5" />
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{rev.name}</h4>
                  <span className="text-xs text-slate-400">{rev.date}</span>
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  <CheckCircle className="w-3 h-3" /> Tetamu Sah
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
