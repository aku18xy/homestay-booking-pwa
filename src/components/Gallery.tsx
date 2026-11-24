'use client';

import React, { useState } from 'react';
import { GalleryItem } from '@/types';
import { Sparkles, Maximize2, X, Image as ImageIcon } from 'lucide-react';

interface GalleryProps {
  galleryItems: GalleryItem[];
  unitName: string;
}

export default function Gallery({ galleryItems, unitName }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [previewImage, setPreviewImage] = useState<GalleryItem | null>(null);

  // Extract unique categories from this unit's gallery
  const categories = ['semua', ...Array.from(new Set(galleryItems.map((g) => g.category)))];

  const filteredItems =
    selectedCategory === 'semua'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'semua':
        return 'Semua Sudut';
      case 'kolam':
        return 'Kolam Renang';
      case 'bilik':
        return 'Bilik Tidur';
      case 'ruang':
        return 'Ruang Tamu';
      case 'dapur':
        return 'Dapur & Makan';
      case 'luaran':
        return 'Laman & Luaran';
      default:
        return cat.toUpperCase();
    }
  };

  return (
    <section id="galeri" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Galeri Foto: {unitName}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Suasana Eksklusif di {unitName}
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Lihat ruang dalaman, kemudahan dan pemandangan sebenar yang menanti ketibaan anda.
          </p>

          {/* Filter Tabs */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          )}
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
