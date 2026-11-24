'use client';

import React from 'react';
import { HomestayUnit } from '@/types';
import { Users, BedDouble, Bath, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface UnitSelectorProps {
  units: HomestayUnit[];
  selectedUnitId: string;
  onSelectUnit: (unitId: string) => void;
}

export default function UnitSelector({
  units,
  selectedUnitId,
  onSelectUnit,
}: UnitSelectorProps) {
  return (
    <section id="pilihan-unit" className="py-12 sm:py-16 bg-slate-100/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Pilihan Unit Homestay
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Pilih Unit Mengikut Keselesaan & Bilangan Tetamu
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Setiap unit mempunyai kolam/taman, galeri gambar, kemudahan dan kalendar kekosongan yang tersendiri.
          </p>
        </div>

        {/* Units Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {units.map((unit) => {
            const isSelected = unit.id === selectedUnitId;

            return (
              <div
                key={unit.id}
                onClick={() => onSelectUnit(unit.id)}
                className={`group cursor-pointer rounded-3xl bg-white border-2 transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-600 shadow-xl ring-4 ring-teal-500/15 -translate-y-1'
                    : 'border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Image & Badge Header */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={unit.featured_image}
                      alt={unit.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {unit.badge && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-teal-700/90 text-white text-[11px] font-black uppercase tracking-wider backdrop-blur-sm shadow-md">
                        {unit.badge}
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center gap-1 shadow-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sedang Dipilih
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-900/80 text-white text-xs font-black backdrop-blur-md">
                      Dari RM {unit.base_weekday_rate} <span className="font-normal text-[10px] text-slate-300">/malam</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-700 transition">
                        {unit.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {unit.tagline}
                      </p>
                    </div>

                    {/* Features bar */}
                    <div className="flex items-center gap-3 pt-1 text-xs text-slate-600 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-semibold">
                        <Users className="w-3.5 h-3.5 text-teal-600" /> {unit.max_guests} Tetamu
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <BedDouble className="w-3.5 h-3.5 text-teal-600" /> {unit.bedrooms} Bilik
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Bath className="w-3.5 h-3.5 text-teal-600" /> {unit.bathrooms} Bilik Air
                      </span>
                    </div>

                    {/* Pricing summary */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Hari Biasa (Isn - Kha)</span>
                        <b className="text-slate-800">RM {unit.base_weekday_rate} / malam</b>
                      </div>
                      <div className="text-right border-l border-slate-200 pl-3">
                        <span className="text-slate-400 block text-[10px]">Hujung Minggu (Jum - Ahd)</span>
                        <b className="text-teal-700">RM {unit.weekend_rate} / malam</b>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                      isSelected
                        ? 'bg-teal-700 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Unit Aktif Dipilih
                      </>
                    ) : (
                      <>
                        Pilih Unit Ini & Semak Kalendar
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
