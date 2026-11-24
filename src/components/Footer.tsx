'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ShieldCheck, Heart, Phone, Globe, Smartphone } from 'lucide-react';
import { HomestaySettings } from '@/types';

interface FooterProps {
  settings: HomestaySettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-14 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-slate-900 font-black">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {settings.homestay_name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {settings.tagline}. Penginapan persendirian yang lengkap, bersih dan mendamaikan untuk anda sekeluarga.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-[11px] font-semibold text-teal-300">
                <Globe className="w-3.5 h-3.5" /> Domain .MY Sah
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-[11px] font-semibold text-teal-300">
                <Smartphone className="w-3.5 h-3.5" /> Webapp PWA Sedia Pasang
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Pautan Pantas
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <a href="#galeri" className="hover:text-white transition">
                  Galeri Foto
                </a>
              </li>
              <li>
                <a href="#kemudahan" className="hover:text-white transition">
                  Kemudahan Homestay
                </a>
              </li>
              <li>
                <a href="#tempah" className="hover:text-white transition">
                  Kalendar & Semak Harga
                </a>
              </li>
              <li>
                <a href="#ulasan" className="hover:text-white transition">
                  Ulasan Tetamu
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  Soalan Lazim (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Owner Portal */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Hubungi Kami
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Sebarang pertanyaan lanjut atau tempahan khas boleh terus berhubung dengan pengurus:
            </p>
            <div className="space-y-2">
              <a
                href={`https://wa.me/${settings.owner_phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-bold transition"
              >
                <Phone className="w-3.5 h-3.5" />
                WhatsApp: +{settings.owner_phone}
              </a>
            </div>
            <div className="pt-2">
              <Link
                href="/admin"
                className="text-xs font-medium text-slate-500 hover:text-slate-300 transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Portal Pemilik (Owner Login)
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {currentYear} {settings.homestay_name}. Hak Cipta Terpelihara.
          </p>
          <p className="flex items-center gap-1">
            Dibina khas dengan Next.js PWA & DuitNow QR
          </p>
        </div>
      </div>
    </footer>
  );
}
