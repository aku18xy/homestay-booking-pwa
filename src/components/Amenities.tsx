'use client';

import React from 'react';
import {
  Waves,
  Wifi,
  Wind,
  Tv,
  Flame,
  Droplets,
  UtensilsCrossed,
  Car,
  Shirt,
  Sparkles,
  Shield,
  Coffee,
} from 'lucide-react';

const AMENITIES = [
  {
    icon: Waves,
    name: 'Kolam Renang Persendirian',
    desc: 'Kolam khas untuk privasi penuh keluarga tanpa bercampur orang lain.',
  },
  {
    icon: Wind,
    name: 'Penghawa Dingin Penuh',
    desc: 'Semua 4 bilik tidur dan ruang tamu dilengkapi unit aircond sejuk.',
  },
  {
    icon: Wifi,
    name: 'WiFi Berkelajuan Tinggi',
    desc: 'Internet fiber 300 Mbps percuma untuk kerja, streaming dan gaming.',
  },
  {
    icon: Tv,
    name: 'Smart TV & Netflix',
    desc: 'TV 55 inci bersama akaun Netflix & YouTube premium tersedia.',
  },
  {
    icon: Flame,
    name: 'Set Pit BBQ Lengkap',
    desc: 'Ruang memanggang santai di tepi kolam berserta penyepit & arang (atas permintaan).',
  },
  {
    icon: Droplets,
    name: 'Penapis Air Coway',
    desc: 'Air sejuk, panas dan suam segera tanpa perlu masak air minuman.',
  },
  {
    icon: UtensilsCrossed,
    name: 'Kelengkapan Memasak Penuh',
    desc: 'Peti ais, dapur induksi, periuk nasi, microwave dan pinggan mangkuk.',
  },
  {
    icon: Car,
    name: 'Parkir Berpagar Luas',
    desc: 'Kawasan anjung luas muat sehingga 3-4 buah kenderaan dengan selamat.',
  },
  {
    icon: Shirt,
    name: 'Mesin Basuh & Seterika',
    desc: 'Mesin basuh automatik beserta ampaian baju dan seterika stim.',
  },
  {
    icon: Coffee,
    name: 'Pakej Minuman Percuma',
    desc: 'Kopi, teh dan gula disediakan percuma untuk santapan tetamu.',
  },
  {
    icon: Shield,
    name: 'Keselamatan Komuniti Berpagar',
    desc: 'Pengawal keselamatan 24 jam & CCTV di bahagian luar pintu pagar.',
  },
  {
    icon: Sparkles,
    name: 'Kelengkapan Solat',
    desc: 'Sejadah bersih, arah kiblat dan kain pelekat/telekung disediakan.',
  },
];

export default function Amenities() {
  return (
    <section id="kemudahan" className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Kemudahan Bertaraf Bintang
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Segalanya Disediakan Untuk Keselesaan Anda
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Anda hanya perlu bawa pakaian dan nikmati suasana santai seperti di rumah sendiri.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {AMENITIES.map((item, idx) => {
            const Icon = item.icon;
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
