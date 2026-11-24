'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import UnitSelector from '@/components/UnitSelector';
import LiveCalendarBooking from '@/components/LiveCalendarBooking';
import Gallery from '@/components/Gallery';
import Amenities from '@/components/Amenities';
import Reviews from '@/components/Reviews';
import LocationSection from '@/components/LocationSection';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { DEFAULT_SETTINGS, INITIAL_UNITS, INITIAL_PRICING_RULES } from '@/lib/mockData';
import { HomestaySettings, HomestayUnit, PricingRule } from '@/types';

export default function Home() {
  const [settings, setSettings] = useState<HomestaySettings>(DEFAULT_SETTINGS);
  const [units, setUnits] = useState<HomestayUnit[]>(INITIAL_UNITS);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(INITIAL_UNITS[0].id);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);

  useEffect(() => {
    // Read local storage settings if owner made updates in admin portal
    const savedSettings = localStorage.getItem('homestay_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedUnits = localStorage.getItem('homestay_units');
    if (savedUnits) {
      setUnits(JSON.parse(savedUnits));
    }
  }, []);

  // Find currently selected unit
  const selectedUnit = units.find((u) => u.id === selectedUnitId) || units[0];

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    // Smooth scroll to booking section
    const bookingEl = document.getElementById('tempah');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-500 selection:text-white">
      {/* 1. Navbar */}
      <Navbar
        homestayName={settings.homestay_name}
        ownerPhone={settings.owner_phone}
      />

      {/* 2. Hero Section */}
      <Hero
        homestayName={settings.homestay_name}
        tagline={settings.tagline}
        units={units}
      />

      {/* 3. Pilihan Unit Homestay */}
      <UnitSelector
        units={units}
        selectedUnitId={selectedUnit.id}
        onSelectUnit={handleSelectUnit}
      />

      {/* 4. Live Calendar & Frictionless Booking (Per-Unit) */}
      <LiveCalendarBooking
        settings={settings}
        selectedUnit={selectedUnit}
        allUnits={units}
        onSelectUnit={handleSelectUnit}
        pricingRules={pricingRules}
      />

      {/* 5. Photo Gallery (Dynamic per Unit) */}
      <Gallery
        galleryItems={selectedUnit.gallery}
        unitName={selectedUnit.name}
      />

      {/* 6. Amenities & Facilities (Dynamic per Unit) */}
      <Amenities
        amenities={selectedUnit.amenities}
        unitName={selectedUnit.name}
      />

      {/* 7. Guest Reviews & Ratings */}
      <Reviews />

      {/* 8. Location & Navigation */}
      <LocationSection settings={settings} />

      {/* 9. FAQ */}
      <FAQ settings={settings} />

      {/* 10. Footer */}
      <Footer settings={settings} />
    </main>
  );
}
