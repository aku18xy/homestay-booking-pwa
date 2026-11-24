'use client';

import React from 'react';
import { Calendar, Sparkles, ShieldCheck, Zap, Users, BedDouble, Waves, Home } from 'lucide-react';
import { HomestayUnit } from '@/types';

interface HeroProps {
  homestayName: string;
  tagline: string;
  units: HomestayUnit[];
}

export default function Hero({ homestayName, tagline, units }: HeroProps) {
  const minRate = Math.min(...units.map((u) => u.base_weekday_rate));

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 text-white py-16 sm:py-24">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-700/50 border border-teal-500/30 text-teal-200 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Koleksi Pelbagai Unit Homestay • Tempah Terus Tanpa Komisen</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
            Percutian Sempurna Seisi Keluarga di{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">
              {homestayName}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed max-w-2xl mx-auto font-normal">
            {tagline}. Pilihan Rumah Utama Keluarga 4 bilik, Unit Transit Pekerja Westport, dan Studio Santai Laguna dengan fasiliti lengkap & selesa.
          </p>

          {/* Highlights feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
              <Home className="w-3.5 h-3.5 text-teal-300" /> {units.length} Pilihan Unit Berbeza
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Tanpa Perlu Daftar Akaun
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Kunci Tarikh Automatik
            </span>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#pilihan-unit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-400/25 transition-all transform hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5 text-slate-900" />
              Pilih Unit Homestay
            </a>
            <a
              href="#tempah"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              <Calendar className="w-5 h-5 text-teal-300" />
              Semak Kalendar & Harga (Dari RM{minRate})
            </a>
          </div>

          {/* Quick Info Grid Bar of Available Units */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8 max-w-4xl mx-auto">
            {units.map((u) => (
              <a
                key={u.id}
                href="#tempah"
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left hover:bg-white/10 transition group"
              >
                <div className="text-xs text-teal-300 font-semibold">{u.badge || 'Unit Selesa'}</div>
                <div className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  {u.name}
                </div>
                <div className="text-xs text-teal-200/70 mt-1">
                  Kapasiti: {u.max_guests} Tetamu • Dari RM{u.base_weekday_rate}/mlm
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
