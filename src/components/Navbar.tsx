'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Calendar, Phone, Menu, X, ShieldCheck, Heart } from 'lucide-react';

interface NavbarProps {
  homestayName?: string;
  ownerPhone?: string;
}

export default function Navbar({
  homestayName = "D'Seri Bayu Homestay",
  ownerPhone = '60123456789',
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanPhone = ownerPhone.replace(/[^0-9]/g, '');

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight block leading-tight">
                {homestayName}
              </span>
              <span className="text-[11px] font-medium text-teal-600 block leading-none">
                Tempahan Pantas & Selesa
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#galeri"
              className="text-sm font-medium text-slate-600 hover:text-teal-700 transition"
            >
              Galeri
            </a>
            <a
              href="#kemudahan"
              className="text-sm font-medium text-slate-600 hover:text-teal-700 transition"
            >
              Kemudahan
            </a>
            <a
              href="#ulasan"
              className="text-sm font-medium text-slate-600 hover:text-teal-700 transition"
            >
              Ulasan
            </a>
            <a
              href="#lokasi"
              className="text-sm font-medium text-slate-600 hover:text-teal-700 transition"
            >
              Lokasi
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-slate-600 hover:text-teal-700 transition"
            >
              FAQ
            </a>
            <Link
              href="/admin"
              className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              Owner Portal
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${cleanPhone}?text=Hai%20Pengurus%20Homestay,%20saya%20berminat%20nak%20tanya%20tentang%20homestay.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <a
              href="#tempah"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/25 transition"
            >
              <Calendar className="w-4 h-4" />
              Semak Tarikh & Tempah
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="#tempah"
              className="px-3 py-1.5 text-xs font-bold rounded-lg text-white bg-teal-600 shadow-sm"
            >
              Tempah
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2.5">
          <a
            href="#galeri"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1.5"
          >
            Galeri Foto
          </a>
          <a
            href="#kemudahan"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1.5"
          >
            Kemudahan & Fasiliti
          </a>
          <a
            href="#ulasan"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1.5"
          >
            Ulasan Tetamu
          </a>
          <a
            href="#lokasi"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1.5"
          >
            Lokasi & Peta
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1.5"
          >
            Soalan Lazim (FAQ)
          </a>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-slate-600 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Owner Portal Login
            </Link>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-700 flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp Owner
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
