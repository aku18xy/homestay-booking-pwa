'use client';

import React from 'react';
import { Calendar, Sparkles, ShieldCheck, Zap, Users, BedDouble, Waves, Wifi } from 'lucide-react';

interface HeroProps {
  homestayName: string;
  tagline: string;
  baseRate: number;
}

export default function Hero({ homestayName, tagline, baseRate }: HeroProps) {
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
            <span>Sistem Tempahan Terus • Tanpa Komisen Pihak Ketiga</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
            Nikmati Ketenangan Sebenar di{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">
              {homestayName}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed max-w-2xl mx-auto font-normal">
            {tagline}. Dilengkapi kolam renang peribadi, ruang luas berhawa dingin, dan fasiliti lengkap untuk percutian berkualiti.
          </p>

          {/* Highlights feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Tanpa Perlu Daftar Akaun
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Kunci Tarikh Automatik
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" /> DuitNow QR Terus ke Owner
            </span>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#tempah"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-400/25 transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5 text-slate-900" />
              Pilih Tarikh & Semak Harga Serta-Merta
            </a>
            <a
              href="#galeri"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              Lihat Galeri Foto
            </a>
          </div>

          {/* Quick Info Grid Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <Users className="w-5 h-5 text-teal-300 mx-auto mb-1.5" />
              <div className="text-base font-bold text-white">10 - 12 Tetamu</div>
              <div className="text-xs text-teal-200/80">Kapasiti Selesa</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <BedDouble className="w-5 h-5 text-teal-300 mx-auto mb-1.5" />
              <div className="text-base font-bold text-white">4 Bilik Tidur</div>
              <div className="text-xs text-teal-200/80">Semua Berhawa Dingin</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <Waves className="w-5 h-5 text-teal-300 mx-auto mb-1.5" />
              <div className="text-base font-bold text-white">Kolam Renang</div>
              <div className="text-xs text-teal-200/80">Persendirian (Private)</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <Wifi className="w-5 h-5 text-teal-300 mx-auto mb-1.5" />
              <div className="text-base font-bold text-white">Dari RM {baseRate}</div>
              <div className="text-xs text-teal-200/80">Kadar Satu Malam</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
