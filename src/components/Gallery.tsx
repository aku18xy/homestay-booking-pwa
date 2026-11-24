'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Maximize2, X } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: 'kolam' | 'bilik' | 'ruang' | 'dapur';
  imageUrl: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: 'Kolam Renang Persendirian',
    category: 'kolam',
    imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1000&q=80',
    description: 'Kolam renang peribadi khas untuk keluarga mandi-manda dengan selamat dan privasi penuh.',
  },
  {
    id: 2,
    title: 'Bilik Utama (Master Bedroom)',
    category: 'bilik',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    description: 'Katil King saiz empuk, penghawa dingin sejuk, bilik air bersambung & pemandangan kolam.',
  },
  {
    id: 3,
    title: 'Ruang Tamu Utama yang Luas',
    category: 'ruang',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
    description: 'Sofa moden yang selesa, Smart TV 55 inci bersama Netflix & YouTube percuma.',
  },
  {
    id: 4,
    title: 'Bilik Tidur Kedua (Queen Bed)',
    category: 'bilik',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
    description: 'Katil Queen berkualiti hotel, almari pakaian dan pendingin hawa.',
  },
  {
    id: 5,
    title: 'Dapur Lengkap & Ruang Makan',
    category: 'dapur',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    description: 'Peti sejuk dua pintu, periuk nasi elektrik, microwave, penapis air Coway dan pinggan mangkuk.',
  },
  {
    id: 6,
    title: 'Ruang Santai & BBQ Luaran',
    category: 'kolam',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    description: 'Meja santai tepi kolam untuk sarapan pagi dan set pit BBQ percuma.',
  },
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [previewImage, setPreviewImage] = useState<GalleryItem | null>(null);

  const filteredItems =
    selectedCategory === 'semua'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section id="galeri" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Galeri Suasana Homestay
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Ruang Elegan & Selesa Untuk Keluarga Anda
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Setiap sudut direka khas untuk memastikan percutian anda sekeluarga tenang, selesa dan penuh kenangan indah.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { id: 'semua', label: 'Semua Sudut' },
              { id: 'kolam', label: 'Kolam & Luaran' },
              { id: 'bilik', label: 'Bilik Tidur' },
              { id: 'ruang', label: 'Ruang Tamu' },
              { id: 'dapur', label: 'Dapur & Meja Makan' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setPreviewImage(item)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Overlay with info on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base sm:text-lg">{item.title}</h3>
                  <Maximize2 className="w-4 h-4 text-teal-300" />
                </div>
                <p className="text-xs text-slate-200 mt-1 line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage.imageUrl}
              alt={previewImage.title}
              className="w-full max-h-[75vh] object-cover"
            />
            <div className="p-5 bg-white">
              <h3 className="text-lg font-bold text-slate-900">{previewImage.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{previewImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
