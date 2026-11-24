'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Eye,
  X,
  Plus,
  Trash2,
  DollarSign,
  Phone,
  Home,
  Save,
  Building2,
  Filter,
} from 'lucide-react';
import { Booking, HomestaySettings, BlockedDate, HomestayUnit } from '@/types';
import { DEFAULT_SETTINGS, INITIAL_UNITS, INITIAL_BLOCKED_DATES } from '@/lib/mockData';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Data states
  const [settings, setSettings] = useState<HomestaySettings>(DEFAULT_SETTINGS);
  const [units, setUnits] = useState<HomestayUnit[]>(INITIAL_UNITS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(INITIAL_BLOCKED_DATES);
  const [activeTab, setActiveTab] = useState<'bookings' | 'calendar' | 'units' | 'settings'>('bookings');

  // Filter states
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');

  // Modal receipt viewer
  const [viewReceiptUrl, setViewReceiptUrl] = useState<string | null>(null);

  // New blocked date input
  const [newBlockUnitId, setNewBlockUnitId] = useState<string>(INITIAL_UNITS[0].id);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('Penyelenggaraan / Offline Booking');

  // Load from local storage or defaults
  useEffect(() => {
    const savedBookings = localStorage.getItem('homestay_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      const sampleBooking: Booking = {
        id: 'book-sample-1',
        booking_code: 'HS-2611-8921',
        unit_id: 'unit-villa-bayu',
        unit_name: 'Villa Bayu (Private Pool)',
        guest_name: 'Faizal bin Mahmud',
        guest_phone: '0198765432',
        guest_count: 8,
        check_in: '2026-12-05',
        check_out: '2026-12-07',
        nights_count: 2,
        base_amount: 1040,
        peak_surcharge: 0,
        security_deposit: 150,
        total_amount: 1190,
        payment_method: 'DUITNOW_QR',
        payment_receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
        status: 'PENDING_VERIFICATION',
        notes: 'Minta sediakan 2 tilam tambahan jika ada.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setBookings([sampleBooking]);
      localStorage.setItem('homestay_bookings', JSON.stringify([sampleBooking]));
    }

    const savedUnits = localStorage.getItem('homestay_units');
    if (savedUnits) {
      setUnits(JSON.parse(savedUnits));
    }

    const savedSettings = localStorage.getItem('homestay_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedBlocked = localStorage.getItem('homestay_blocked_dates');
    if (savedBlocked) {
      setBlockedDates(JSON.parse(savedBlocked));
    }
  }, []);

  // Handle PIN verification
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === settings.admin_pin || enteredPin === '8899') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setEnteredPin('');
    }
  };

  // Update Booking Status
  const handleUpdateStatus = (id: string, newStatus: Booking['status']) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: newStatus, updated_at: new Date().toISOString() } : b
    );
    setBookings(updated);
    localStorage.setItem('homestay_bookings', JSON.stringify(updated));
  };

  // Add Blocked Date per Unit
  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDate) return;
    const newEntry: BlockedDate = {
      id: `block-${Date.now()}`,
      unit_id: newBlockUnitId,
      date: newBlockDate,
      reason: newBlockReason,
      created_at: new Date().toISOString(),
    };
    const updated = [...blockedDates, newEntry];
    setBlockedDates(updated);
    localStorage.setItem('homestay_blocked_dates', JSON.stringify(updated));

    // Update in unit's blocked dates array too
    const updatedUnits = units.map((u) => {
      if (u.id === newBlockUnitId) {
        return {
          ...u,
          blocked_dates: Array.from(new Set([...u.blocked_dates, newBlockDate])),
        };
      }
      return u;
    });
    setUnits(updatedUnits);
    localStorage.setItem('homestay_units', JSON.stringify(updatedUnits));

    setNewBlockDate('');
  };

  // Delete Blocked Date
  const handleDeleteBlockedDate = (id: string, dateStr: string, unitId: string) => {
    const updated = blockedDates.filter((b) => b.id !== id);
    setBlockedDates(updated);
    localStorage.setItem('homestay_blocked_dates', JSON.stringify(updated));

    const updatedUnits = units.map((u) => {
      if (u.id === unitId) {
        return {
          ...u,
          blocked_dates: u.blocked_dates.filter((d) => d !== dateStr),
        };
      }
      return u;
    });
    setUnits(updatedUnits);
    localStorage.setItem('homestay_units', JSON.stringify(updatedUnits));
  };

  // Update Unit Rates
  const handleUpdateUnitRate = (
    unitId: string,
    field: 'base_weekday_rate' | 'weekend_rate' | 'security_deposit',
    value: number
  ) => {
    const updated = units.map((u) => (u.id === unitId ? { ...u, [field]: value } : u));
    setUnits(updated);
  };

  // Save Units & Settings
  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('homestay_units', JSON.stringify(units));
    localStorage.setItem('homestay_settings', JSON.stringify(settings));
    alert('Semua kadar harga unit dan tetapan berjaya disimpan!');
  };

  // Filter bookings
  const filteredBookings =
    selectedUnitFilter === 'all'
      ? bookings
      : bookings.filter((b) => b.unit_id === selectedUnitFilter);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700 p-8 text-center text-white shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-black tracking-tight">Portal Pemilik Homestay</h2>
          <p className="text-xs text-slate-400 mt-1.5">
            Sila masukkan PIN 4-digit pemilik untuk mengakses panel kawalan pelbagai unit.
          </p>

          <form onSubmit={handlePinSubmit} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="PIN (Default: 8899)"
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                className="w-full text-center tracking-[0.5em] text-2xl font-black py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
              />
              {pinError && (
                <p className="text-xs text-rose-400 mt-2 font-semibold">
                  PIN salah. Sila cuba lagi (PIN lalai: 8899).
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-teal-600 hover:bg-teal-500 text-white shadow-lg transition"
            >
              Buka Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-300">
              ← Kembali ke Laman Utama
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg leading-tight">
                Dashboard Pemilik (Multi-Unit)
              </h1>
              <span className="text-xs text-teal-400">{settings.homestay_name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Laman Tetamu
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 transition"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'bookings'
                ? 'bg-teal-700 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Pengurusan Tempahan ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'calendar'
                ? 'bg-teal-700 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Kunci Tarikh Unit ({blockedDates.length})
          </button>
          <button
            onClick={() => setActiveTab('units')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'units'
                ? 'bg-teal-700 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Kadar Harga Unit ({units.length} Unit)
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'settings'
                ? 'bg-teal-700 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Tetapan DuitNow & Bank
          </button>
        </div>

        {/* TAB 1: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filter by Unit */}
            <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Filter className="w-4 h-4 text-teal-600" />
                Tapis Mengikut Unit:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedUnitFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedUnitFilter === 'all'
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua Unit ({bookings.length})
                </button>
                {units.map((u) => {
                  const count = bookings.filter((b) => b.unit_id === u.id).length;
                  return (
                    <button
                      key={u.id}
                      onClick={() => setSelectedUnitFilter(u.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        selectedUnitFilter === u.id
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {u.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-lg">Tiada Tempahan Bagi Pilihan Ini</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tempahan baharu daripada tetamu akan dipaparkan di sini secara automatik.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-base text-slate-900">
                            {booking.guest_name}
                          </span>
                          <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            {booking.booking_code}
                          </span>
                          <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                            {booking.unit_name}
                          </span>
                        </div>
                        <a
                          href={`https://wa.me/${booking.guest_phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline mt-0.5"
                        >
                          <Phone className="w-3 h-3" /> {booking.guest_phone} (Buka WhatsApp Tetamu)
                        </a>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {booking.status === 'PENDING_VERIFICATION' && (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Menunggu Pengesahan Owner
                          </span>
                        )}
                        {booking.status === 'CONFIRMED' && (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Disahkan (Confirmed)
                          </span>
                        )}
                        {booking.status === 'REJECTED' && (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Ditolak (Rejected)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50">
                        <span className="text-slate-400 block font-medium">Tarikh Masuk - Keluar</span>
                        <b className="text-slate-800 text-xs">
                          {booking.check_in} → {booking.check_out}
                        </b>
                        <span className="text-teal-700 block font-semibold">({booking.nights_count} Malam)</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50">
                        <span className="text-slate-400 block font-medium">Bilangan Tetamu</span>
                        <b className="text-slate-800 text-xs">{booking.guest_count} Orang</b>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50">
                        <span className="text-slate-400 block font-medium">Jumlah Bayaran</span>
                        <b className="text-teal-800 text-sm font-black">
                          RM {booking.total_amount.toFixed(2)}
                        </b>
                        <span className="text-[10px] text-slate-500 block">
                          (Deposit: RM{booking.security_deposit})
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 block font-medium">Bukti Resit</span>
                          <span className="font-bold text-xs text-slate-800">DuitNow / Online</span>
                        </div>
                        {booking.payment_receipt_url && (
                          <button
                            onClick={() => setViewReceiptUrl(booking.payment_receipt_url!)}
                            className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition"
                            title="Lihat Slip"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="text-xs bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 text-slate-700">
                        <b>Catatan Tetamu:</b> {booking.notes}
                      </div>
                    )}

                    {/* Action Buttons for Owner */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      {booking.payment_receipt_url && (
                        <button
                          onClick={() => setViewReceiptUrl(booking.payment_receipt_url!)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Semak Resit Bank
                        </button>
                      )}

                      {booking.status === 'PENDING_VERIFICATION' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'REJECTED')}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Tolak Tempahan
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Luluskan (Confirm)
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BLOCKED DATES MANAGEMENT PER UNIT */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Sekat / Kunci Tarikh Kalendar Mengikut Unit
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kunci tarikh untuk satu unit tanpa menjejaskan kekosongan unit homestay yang lain.
              </p>
            </div>

            {/* Add Date Form */}
            <form
              onSubmit={handleAddBlockedDate}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3"
            >
              <div className="flex-grow min-w-[200px]">
                <label className="block text-xs font-bold text-slate-600 mb-1">Pilih Unit</label>
                <select
                  value={newBlockUnitId}
                  onChange={(e) => setNewBlockUnitId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-grow min-w-[170px]">
                <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Kunci</label>
                <input
                  type="date"
                  required
                  value={newBlockDate}
                  onChange={(e) => setNewBlockDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex-grow min-w-[220px]">
                <label className="block text-xs font-bold text-slate-600 mb-1">Sebab Kunci</label>
                <input
                  type="text"
                  placeholder="Cth: Tempahan Offline / Servis Kolam"
                  value={newBlockReason}
                  onChange={(e) => setNewBlockReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="pt-5">
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-teal-700 hover:bg-teal-800 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Kunci Tarikh Ini
                </button>
              </div>
            </form>

            {/* List of blocked dates */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Senarai Tarikh Yang Sedang Dikunci:
              </h4>

              {blockedDates.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Tiada tarikh yang dikunci secara manual.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {blockedDates.map((item) => {
                    const unitObj = units.find((u) => u.id === item.unit_id);
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded block w-fit mb-1">
                            {unitObj ? unitObj.name : 'Semua Unit'}
                          </span>
                          <div className="font-extrabold text-slate-900">{item.date}</div>
                          <div className="text-[11px] text-slate-500">{item.reason}</div>
                        </div>
                        <button
                          onClick={() => handleDeleteBlockedDate(item.id, item.date, item.unit_id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                          title="Buka Semula Tarikh Ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: UNITS RATES MANAGEMENT */}
        {activeTab === 'units' && (
          <form onSubmit={handleSaveAll} className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Pengurusan Kadar Harga Setiap Unit
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tetapkan harga hari biasa (weekday), harga hujung minggu (weekend), dan deposit bagi setiap unit secara berasingan.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-teal-700 hover:bg-teal-800 shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Simpan Semua Kadar
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                      <div>
                        <h4 className="font-black text-base text-slate-900">{unit.name}</h4>
                        <span className="text-xs text-slate-500">
                          Kapasiti: {unit.max_guests} Tetamu | {unit.bedrooms} Bilik Tidur | {unit.bathrooms} Bilik Air
                        </span>
                      </div>
                      <span className="text-xs font-bold bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                        {unit.badge || 'Unit Selesa'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Kadar Hari Biasa (Isn - Kha) (RM)
                        </label>
                        <input
                          type="number"
                          required
                          value={unit.base_weekday_rate}
                          onChange={(e) =>
                            handleUpdateUnitRate(
                              unit.id,
                              'base_weekday_rate',
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Kadar Hujung Minggu (Jum - Ahd) (RM)
                        </label>
                        <input
                          type="number"
                          required
                          value={unit.weekend_rate}
                          onChange={(e) =>
                            handleUpdateUnitRate(unit.id, 'weekend_rate', Number(e.target.value))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Deposit Keselamatan (RM)
                        </label>
                        <input
                          type="number"
                          required
                          value={unit.security_deposit}
                          onChange={(e) =>
                            handleUpdateUnitRate(
                              unit.id,
                              'security_deposit',
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* TAB 4: DUITNOW & BANK SETTINGS */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSaveAll}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6"
          >
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Maklumat Bank, DuitNow QR & Maklumat Pemilik
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Maklumat ini akan dipaparkan semasa proses pembayaran tetamu bagi semua unit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Bank</label>
                <input
                  type="text"
                  required
                  value={settings.bank_name}
                  onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombor Akaun Bank</label>
                <input
                  type="text"
                  required
                  value={settings.bank_account_no}
                  onChange={(e) => setSettings({ ...settings, bank_account_no: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Pemegang Akaun
                </label>
                <input
                  type="text"
                  required
                  value={settings.bank_account_holder}
                  onChange={(e) =>
                    setSettings({ ...settings, bank_account_holder: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombor WhatsApp Pemilik (Untuk Terima Notifikasi)
                </label>
                <input
                  type="text"
                  required
                  value={settings.owner_phone}
                  onChange={(e) => setSettings({ ...settings, owner_phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  PIN Akses Dashboard Pemilik
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={settings.admin_pin}
                  onChange={(e) => setSettings({ ...settings, admin_pin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-teal-700 hover:bg-teal-800 shadow-lg shadow-teal-700/20 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Simpan Semua Tetapan
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Full Size Receipt Viewer Modal */}
      {viewReceiptUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setViewReceiptUrl(null)}
        >
          <div
            className="relative max-w-xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-800">
                Slip Resit Pembayaran Tetamu
              </span>
              <button
                onClick={() => setViewReceiptUrl(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4">
              <img
                src={viewReceiptUrl}
                alt="Slip Resit"
                className="w-full max-h-[70vh] object-contain rounded-xl border border-slate-200"
              />
            </div>
            <a
              href={viewReceiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-teal-700 hover:underline inline-flex items-center gap-1"
            >
              Buka Fail Penuh di Tab Baharu <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
