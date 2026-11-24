'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import Amenities from '@/components/Amenities';
import LiveCalendarBooking from '@/components/LiveCalendarBooking';
import Reviews from '@/components/Reviews';
import LocationSection from '@/components/LocationSection';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { DEFAULT_SETTINGS, INITIAL_BLOCKED_DATES, INITIAL_PRICING_RULES } from '@/lib/mockData';
import { HomestaySettings, BlockedDate, PricingRule } from '@/types';

export default function Home() {
  const [settings, setSettings] = useState<HomestaySettings>(DEFAULT_SETTINGS);
  const [blockedDates, setBlockedDates] = useState<string[]>(['2026-11-28', '2026-11-29']);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);

  useEffect(() => {
    // Read local storage settings if owner made updates in admin portal
    const savedSettings = localStorage.getItem('homestay_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedBlocked = localStorage.getItem('homestay_blocked_dates');
    if (savedBlocked) {
      const parsed: BlockedDate[] = JSON.parse(savedBlocked);
      setBlockedDates(parsed.map((b) => b.date));
    }
  }, []);

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
        baseRate={settings.base_weekday_rate}
      />

      {/* 3. Live Calendar & Frictionless Booking (Core Feature) */}
      <LiveCalendarBooking
        settings={settings}
        blockedDates={blockedDates}
        pricingRules={pricingRules}
      />

      {/* 4. Photo Gallery */}
      <Gallery />

      {/* 5. Amenities & Facilities */}
      <Amenities />

      {/* 6. Guest Reviews & Ratings */}
      <Reviews />

      {/* 7. Location & Navigation */}
      <LocationSection settings={settings} />

      {/* 8. FAQ */}
      <FAQ settings={settings} />

      {/* 9. Footer */}
      <Footer settings={settings} />
    </main>
  );
}
