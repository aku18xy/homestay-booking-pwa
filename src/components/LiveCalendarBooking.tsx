'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfToday,
  addDays,
  parseISO,
} from 'date-fns';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Copy,
  UploadCloud,
  FileCheck,
  Phone,
  Sparkles,
  Home,
  Users,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HomestaySettings, HomestayUnit, PricingRule, PriceBreakdown, Booking } from '@/types';
import { calculateBookingPrice } from '@/lib/pricing';
import { generateOwnerBookingWhatsAppUrl } from '@/lib/whatsapp';

interface LiveCalendarBookingProps {
  settings: HomestaySettings;
  selectedUnit: HomestayUnit;
  allUnits: HomestayUnit[];
  onSelectUnit: (unitId: string) => void;
  pricingRules?: PricingRule[];
}

export default function LiveCalendarBooking({
  settings,
  selectedUnit,
  allUnits,
  onSelectUnit,
  pricingRules = [],
}: LiveCalendarBookingProps) {
  const today = startOfToday();

  // Calendar navigation state
  const [currentMonth, setCurrentMonth] = useState<Date>(today);

  // Selected range
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);

  // Modal / Step state: 'SELECTING' | 'CHECKOUT' | 'SUCCESS'
  const [bookingStep, setBookingStep] = useState<'SELECTING' | 'CHECKOUT' | 'SUCCESS'>('SELECTING');

  // Guest input form (No login needed!)
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [stayPurpose, setStayPurpose] = useState('Majlis Keraian/Kenduri');
  const [guestCount, setGuestCount] = useState(selectedUnit.max_guests > 4 ? 4 : 2);
  const [refundBankInfo, setRefundBankInfo] = useState('');
  const [checklistAgreed, setChecklistAgreed] = useState(true);
  const [notes, setNotes] = useState('');
  const [paymentType, setPaymentType] = useState<'DEPOSIT' | 'FULL'>('DEPOSIT');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [sendReceiptViaWhatsApp, setSendReceiptViaWhatsApp] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // State flags
  const [copiedBank, setCopiedBank] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Reset dates or validate when unit changes
  useEffect(() => {
    setCheckInDate(null);
    setCheckOutDate(null);
  }, [selectedUnit.id]);

  // Set of blocked dates for the selected unit
  const blockedDatesSet = useMemo(() => {
    return new Set(selectedUnit.blocked_dates || []);
  }, [selectedUnit]);

  // Check if a date is blocked or in the past
  const isDateUnavailable = (date: Date) => {
    if (isBefore(date, today)) return true;
    const dateStr = format(date, 'yyyy-MM-dd');
    return blockedDatesSet.has(dateStr);
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (isDateUnavailable(date)) return;

    const dateStr = format(date, 'yyyy-MM-dd');

    // Case 1: Start fresh with CheckIn
    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(dateStr);
      setCheckOutDate(null);
      return;
    }

    // Case 2: CheckIn selected, selecting CheckOut
    if (checkInDate && !checkOutDate) {
      const checkInObj = parseISO(checkInDate);

      // If clicked date is before or equal to checkIn, reset checkIn
      if (isBefore(date, checkInObj) || isSameDay(date, checkInObj)) {
        setCheckInDate(dateStr);
        setCheckOutDate(null);
        return;
      }

      // Check if any blocked date lies between checkIn and selected checkOut
      let cur = addDays(checkInObj, 1);
      let hasConflict = false;
      while (isBefore(cur, date)) {
        if (blockedDatesSet.has(format(cur, 'yyyy-MM-dd'))) {
          hasConflict = true;
          break;
        }
        cur = addDays(cur, 1);
      }

      if (hasConflict) {
        alert(
          `Terdapat tarikh yang telah ditempah untuk ${selectedUnit.name} di antara pilihan anda. Sila pilih julat tarikh yang lain.`
        );
        return;
      }

      setCheckOutDate(dateStr);
    }
  };

  // Realtime Price calculation based on SELECTED UNIT's rates
  const priceBreakdown: PriceBreakdown | null = useMemo(() => {
    if (!checkInDate || !checkOutDate) return null;
    return calculateBookingPrice(
      checkInDate,
      checkOutDate,
      selectedUnit.base_weekday_rate,
      selectedUnit.weekend_rate,
      selectedUnit.security_deposit,
      pricingRules
    );
  }, [checkInDate, checkOutDate, selectedUnit, pricingRules]);

  // Kiraan Pilihan Bayaran: Deposit vs Penuh
  const depositAmount = selectedUnit.security_deposit || 100;
  const amountToPay = priceBreakdown
    ? paymentType === 'DEPOSIT'
      ? depositAmount
      : priceBreakdown.total
    : 0;
  const balanceDue = priceBreakdown
    ? paymentType === 'DEPOSIT'
      ? priceBreakdown.total - depositAmount
      : 0
    : 0;

  // Proceed to checkout
  const handleProceedToCheckout = () => {
    if (!checkInDate || !checkOutDate || !priceBreakdown) return;
    setBookingStep('CHECKOUT');
    window.scrollTo({ top: document.getElementById('tempah')?.offsetTop || 0, behavior: 'smooth' });
  };

  // Copy bank account number
  const handleCopyBank = () => {
    navigator.clipboard.writeText(settings.bank_account_no);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  // Receipt file upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  // Handle final submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!guestName.trim()) {
      setFormError('Sila isi nama penuh anda di Ruangan 1.');
      return;
    }
    if (!guestPhone.trim()) {
      setFormError('Sila isi nombor WhatsApp anda di Ruangan 1.');
      return;
    }
    if (!receiptFile && !sendReceiptViaWhatsApp) {
      setFormError('Sila muat naik slip resit bayaran di bawah, ATAU tandakan pilihan untuk menghantar resit terus di WhatsApp.');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingCode = `HS-${format(new Date(), 'yyMM')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking: Booking = {
        id: `book-${Date.now()}`,
        booking_code: bookingCode,
        unit_id: selectedUnit.id,
        unit_name: selectedUnit.name,
        guest_name: guestName,
        guest_phone: guestPhone,
        guest_email: guestEmail.trim() || undefined,
        ic_number: icNumber.trim() || undefined,
        guest_address: guestAddress.trim() || undefined,
        stay_purpose: stayPurpose,
        refund_bank_info: refundBankInfo.trim() || undefined,
        guest_count: guestCount,
        check_in: checkInDate!,
        check_out: checkOutDate!,
        nights_count: priceBreakdown!.nights,
        base_amount: priceBreakdown!.weekdayTotal + priceBreakdown!.weekendTotal,
        peak_surcharge: priceBreakdown!.peakSurcharge,
        security_deposit: priceBreakdown!.securityDeposit,
        total_amount: priceBreakdown!.total,
        payment_type: paymentType,
        amount_paid: amountToPay,
        balance_due: balanceDue,
        payment_method: 'DUITNOW_QR',
        payment_receipt_url: receiptPreview || (sendReceiptViaWhatsApp ? 'Dihantar terus melalui WhatsApp' : ''),
        status: 'PENDING_VERIFICATION',
        notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save locally to localStorage so owner dashboard can read it immediately
      const existing = JSON.parse(localStorage.getItem('homestay_bookings') || '[]');
      existing.unshift(newBooking);
      localStorage.setItem('homestay_bookings', JSON.stringify(existing));

      // Asynchronously sync to Google Sheets webhook if configured
      if (settings.google_sheets_webhook_url) {
        fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booking: newBooking,
            webhookUrl: settings.google_sheets_webhook_url,
          }),
        }).catch((e) => console.warn('Background sync error:', e));
      }

      // Trigger celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setCreatedBooking(newBooking);
      setBookingStep('SUCCESS');
    } catch (err) {
      console.error(err);
      alert('Ralat semasa memproses tempahan. Sila cuba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar days generation
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <section id="tempah" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
            Kalendar Langsung Mengikut Unit
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Pilih Tarikh & Semak Harga Serta-Merta
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Kekosongan kalendar dikunci secara berasingan untuk setiap unit bagi mengelakkan <i>double book</i>.
          </p>
        </div>

        {/* Unit Selector Quick Tabs on Calendar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {allUnits.map((u) => {
            const isCurrent = u.id === selectedUnit.id;
            return (
              <button
                key={u.id}
                onClick={() => onSelectUnit(u.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                  isCurrent
                    ? 'bg-teal-700 text-white shadow-lg shadow-teal-700/25 ring-2 ring-teal-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>{u.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isCurrent ? 'bg-teal-800 text-teal-100' : 'bg-slate-200 text-slate-600'}`}>
                  RM{u.base_weekday_rate}/mlm
                </span>
              </button>
            );
          })}
        </div>

        {/* STEP 1: SELECTING DATES */}
        {bookingStep === 'SELECTING' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Interactive Calendar */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
              {/* Unit Info banner above calendar */}
              <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">
                    Kalendar Kekosongan:
                  </span>
                  <h3 className="text-lg font-black text-slate-900">{selectedUnit.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Kapasiti Maksimum:</span>
                  <span className="text-xs font-bold text-slate-700">{selectedUnit.max_guests} Tetamu</span>
                </div>
              </div>

              {/* Calendar Month Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h4>
                  <p className="text-xs text-slate-500">Pilih tarikh check-in & check-out</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    disabled={isSameMonth(currentMonth, today)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    aria-label="Bulan Lepas"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-700" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                    aria-label="Bulan Hadapan"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab', 'Ahd'].map((day, idx) => (
                  <div
                    key={day}
                    className={`text-xs font-bold py-1 ${
                      idx >= 4 ? 'text-amber-600' : 'text-slate-400'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {calendarDays.map((date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const isCurrentMonth = isSameMonth(date, currentMonth);
                  const isUnavailable = isDateUnavailable(date);
                  const isCheckIn = checkInDate === dateStr;
                  const isCheckOut = checkOutDate === dateStr;
                  const isInRange =
                    checkInDate &&
                    checkOutDate &&
                    dateStr > checkInDate &&
                    dateStr < checkOutDate;

                  let cellClass =
                    'h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all relative ';

                  if (!isCurrentMonth) {
                    cellClass += 'text-slate-300 opacity-40 ';
                  } else if (isUnavailable) {
                    cellClass +=
                      'bg-slate-100 text-slate-400 line-through cursor-not-allowed ';
                  } else if (isCheckIn || isCheckOut) {
                    cellClass +=
                      'bg-teal-700 text-white font-bold shadow-md shadow-teal-700/30 scale-105 z-10 ';
                  } else if (isInRange) {
                    cellClass += 'bg-teal-50 text-teal-900 rounded-none font-bold ';
                  } else {
                    cellClass += 'hover:bg-teal-100/60 text-slate-700 cursor-pointer ';
                  }

                  return (
                    <button
                      key={dateStr}
                      disabled={isUnavailable || !isCurrentMonth}
                      onClick={() => handleDateClick(date)}
                      className={cellClass}
                    >
                      <span>{format(date, 'd')}</span>
                      {isCheckIn && (
                        <span className="text-[9px] uppercase tracking-tighter leading-none mt-0.5 font-bold">
                          In
                        </span>
                      )}
                      {isCheckOut && (
                        <span className="text-[9px] uppercase tracking-tighter leading-none mt-0.5 font-bold">
                          Out
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-teal-700" />
                  <span>Pilihan Anda</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-slate-200 line-through text-[9px] flex items-center justify-center text-slate-500">
                    ✕
                  </div>
                  <span>Penuh / Dikunci ({selectedUnit.name})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded border border-slate-300" />
                  <span>Kekosongan Sedia Ada</span>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Live Price Calculator & Lock Card */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Ringkasan Tempahan
                </h3>
                <span className="text-xs bg-teal-800/80 text-teal-200 px-2.5 py-1 rounded-lg font-bold">
                  {selectedUnit.name}
                </span>
              </div>

              {/* Dates Box */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md mb-5">
                <div>
                  <span className="text-[11px] text-teal-200 uppercase font-bold block mb-1">
                    Tarikh Masuk
                  </span>
                  <div className="font-extrabold text-sm sm:text-base text-white">
                    {checkInDate ? format(parseISO(checkInDate), 'dd MMM yyyy') : '-- Sila Pilih --'}
                  </div>
                  <span className="text-[10px] text-slate-300">Selepas {settings.check_in_time}</span>
                </div>
                <div className="border-l border-white/10 pl-3">
                  <span className="text-[11px] text-teal-200 uppercase font-bold block mb-1">
                    Tarikh Keluar
                  </span>
                  <div className="font-extrabold text-sm sm:text-base text-white">
                    {checkOutDate ? format(parseISO(checkOutDate), 'dd MMM yyyy') : '-- Sila Pilih --'}
                  </div>
                  <span className="text-[10px] text-slate-300">Sebelum {settings.check_out_time}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              {priceBreakdown ? (
                <div className="space-y-2.5 text-xs sm:text-sm border-t border-white/10 pt-4">
                  {priceBreakdown.weekdayNights > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Hari Biasa ({priceBreakdown.weekdayNights} malam × RM{selectedUnit.base_weekday_rate}):</span>
                      <span className="font-semibold text-white">RM {priceBreakdown.weekdayTotal.toFixed(2)}</span>
                    </div>
                  )}

                  {priceBreakdown.weekendNights > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Hujung Minggu ({priceBreakdown.weekendNights} malam × RM{selectedUnit.weekend_rate}):</span>
                      <span className="font-semibold text-white">RM {priceBreakdown.weekendTotal.toFixed(2)}</span>
                    </div>
                  )}

                  {priceBreakdown.peakSurcharge > 0 && (
                    <div className="flex justify-between text-amber-300">
                      <span>Surcaj Cuti Umum / Musim Puncak:</span>
                      <span className="font-semibold">+ RM {priceBreakdown.peakSurcharge.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-300">
                    <span>Deposit Keselamatan (Dipulangkan):</span>
                    <span className="font-semibold text-white">RM {priceBreakdown.securityDeposit.toFixed(2)}</span>
                  </div>

                  {/* Total */}
                  <div className="pt-3 border-t border-white/20 flex justify-between items-baseline">
                    <div>
                      <span className="text-xs text-teal-300 font-bold block">JUMLAH KESELURUHAN</span>
                      <span className="text-[10px] text-slate-400">({priceBreakdown.nights} malam penginapan)</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-400">
                      RM {priceBreakdown.total.toFixed(2)}
                    </div>
                  </div>

                  {/* Proceed button */}
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full mt-6 py-3.5 px-4 rounded-xl font-black text-sm text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-400/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-900" />
                    Kunci Tarikh {selectedUnit.name} & Terus Bayar
                  </button>

                  <p className="text-[11px] text-center text-teal-200/70 mt-2">
                    ⚡ Tarikh akan dikunci selama 10 minit untuk mengelakkan orang lain tempah.
                  </p>
                </div>
              ) : (
                <div className="py-8 text-center border-t border-white/10">
                  <Clock className="w-8 h-8 text-teal-400/60 mx-auto mb-2" />
                  <p className="text-xs text-slate-300">
                    Sila pilih tarikh Check-in dan Check-out di kalendar untuk melihat kiraan harga automatik bagi <b>{selectedUnit.name}</b>.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: NO-LOGIN CHECKOUT & DUITNOW QR PAYMENT */}
        {bookingStep === 'CHECKOUT' && priceBreakdown && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10">
            {/* Top Bar with Lock Timer */}
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-100 gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">
                  Langkah Terakhir: Bayaran Terus
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Tempahan: {selectedUnit.name}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                Tarikh Dikunci: 10 Minit
              </div>
            </div>

            {/* Booking Summary Pill */}
            <div className="my-6 p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-500 font-medium">Unit:</span>{' '}
                <b className="text-teal-900">{selectedUnit.name}</b> |{' '}
                <b className="text-slate-900">{checkInDate}</b> hingga{' '}
                <b className="text-slate-900">{checkOutDate}</b> ({priceBreakdown.nights} malam)
              </div>
              <div className="text-base font-black text-teal-800">
                Jumlah: RM {priceBreakdown.total.toFixed(2)}
              </div>
            </div>

            <form onSubmit={handleSubmitBooking} noValidate className="space-y-6">
              {/* Guest Details: NO ACCOUNT REQUIRED */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase text-slate-700 tracking-wider">
                    1. Maklumat Tetamu (Tanpa Daftar Akaun)
                  </h4>
                  <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2.5 py-0.5 rounded-full">
                    Kemas kini automatik ke Google Sheets
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Penuh (seperti dalam kad pengenalan) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Cth: Ahmad bin Farhan"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nombor Kad Pengenalan (tanpa tanda -)
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      placeholder="Cth: 880101105555"
                      value={icNumber}
                      onChange={(e) => setIcNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-medium font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nombor WhatsApp / Telefon <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Cth: 0123456789"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Alamat Emel (Pilihan)
                    </label>
                    <input
                      type="email"
                      placeholder="Cth: ahmad@gmail.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Alamat Penuh Penyewa (Pilihan)
                  </label>
                  <input
                    type="text"
                    placeholder="Cth: No. 12, Jalan Indah 3, Taman Desa, Pulau Indah"
                    value={guestAddress}
                    onChange={(e) => setGuestAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tujuan Menginap di JADI Homestay
                    </label>
                    <select
                      value={stayPurpose}
                      onChange={(e) => setStayPurpose(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-medium bg-white"
                    >
                      <option value="Majlis Keraian/Kenduri">Majlis Keraian / Kenduri</option>
                      <option value="Melawat Saudara/Keluarga">Melawat Saudara / Ziarah</option>
                      <option value="Bekerja">Bekerja (Westport / Industri)</option>
                      <option value="Kursus/Bengkel">Kursus / Bengkel</option>
                      <option value="Percutian/Santai">Percutian / Santai</option>
                      <option value="Lain-lain">Lain-lain Tujuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Bil. Tetamu (Maks: {selectedUnit.max_guests} orang)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={selectedUnit.max_guests}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Catatan / Permintaan Khas
                    </label>
                    <input
                      type="text"
                      placeholder="Cth: Check-in jam 4 petang"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section: DuitNow QR & Bank Info */}
              <div className="pt-6 border-t border-slate-200 space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase text-slate-700 tracking-wider">
                    2. Bayaran Terus ke Akaun Owner (DuitNow QR)
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    Pilih bayar deposit atau penuh
                  </span>
                </div>

                {/* Pilihan Bayaran: Deposit vs Penuh */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Pilih Jumlah Bayaran Sekarang <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option 1: Bayar Deposit */}
                    <div
                      onClick={() => setPaymentType('DEPOSIT')}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                        paymentType === 'DEPOSIT'
                          ? 'border-teal-600 bg-teal-50/70 shadow-sm ring-2 ring-teal-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        id="pay-deposit"
                        name="paymentType"
                        checked={paymentType === 'DEPOSIT'}
                        onChange={() => setPaymentType('DEPOSIT')}
                        className="mt-1 w-4 h-4 text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="pay-deposit" className="cursor-pointer block flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900">
                            Bayar Deposit Sahaja
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Kunci Tarikh
                          </span>
                        </div>
                        <div className="text-xl font-black text-teal-800 mt-1">
                          RM {depositAmount.toFixed(2)}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          Baki <b>RM {balanceDue.toFixed(2)}</b> dijelaskan semasa atau sebelum check-in.
                        </p>
                      </label>
                    </div>

                    {/* Option 2: Bayar Penuh */}
                    <div
                      onClick={() => setPaymentType('FULL')}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                        paymentType === 'FULL'
                          ? 'border-teal-600 bg-teal-50/70 shadow-sm ring-2 ring-teal-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        id="pay-full"
                        name="paymentType"
                        checked={paymentType === 'FULL'}
                        onChange={() => setPaymentType('FULL')}
                        className="mt-1 w-4 h-4 text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="pay-full" className="cursor-pointer block flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900">
                            Bayar Jumlah Penuh
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Selesai Semua
                          </span>
                        </div>
                        <div className="text-xl font-black text-teal-800 mt-1">
                          RM {priceBreakdown.total.toFixed(2)}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          Selesai penginapan ({priceBreakdown.nights} malam) + deposit keselamatan.
                        </p>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center gap-6">
                  {/* QR Image */}
                  <div className="w-44 h-44 p-2 bg-white rounded-xl border border-slate-200 shadow-sm flex-shrink-0 flex items-center justify-center">
                    <img
                      src={settings.duitnow_qr_url}
                      alt="DuitNow QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Bank Details */}
                  <div className="space-y-2 text-center md:text-left text-sm flex-grow">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Duit Masuk Terus ke Akaun Sah Owner
                    </div>

                    <div className="font-black text-xl text-slate-900">
                      {settings.bank_name}
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <code className="text-lg font-extrabold text-teal-800 tracking-wider bg-white px-3 py-1 rounded-lg border border-slate-200">
                        {settings.bank_account_no}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyBank}
                        className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition"
                        title="Salin Nombor Akaun"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {copiedBank && (
                        <span className="text-xs text-teal-600 font-bold">Disalin!</span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600">
                      Nama Pemegang: <b>{settings.bank_account_holder}</b>
                    </div>

                    <div className="text-xs font-bold text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                      <div>
                        Jumlah Tepat Perlu Dipindahkan ({paymentType === 'DEPOSIT' ? 'Deposit Sahaja' : 'Bayaran Penuh'}):
                      </div>
                      <div className="text-xl font-black text-amber-900 mt-0.5">
                        RM {amountToPay.toFixed(2)}
                      </div>
                      {paymentType === 'DEPOSIT' && (
                        <div className="text-[11px] font-medium text-amber-700 mt-0.5">
                          (Baki RM {balanceDue.toFixed(2)} perlu dibayar semasa atau sebelum check-in)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Receipt Upload Component */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Muat Naik Bukti Bayaran / Slip Resit Bank
                    </label>
                    <span className="text-[11px] text-teal-700 font-semibold">
                      (Pilihan: Upload di sini atau hantar di WhatsApp)
                    </span>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-2xl p-6 text-center bg-white cursor-pointer transition ${
                      formError && !receiptFile && !sendReceiptViaWhatsApp
                        ? 'border-rose-400 bg-rose-50/20'
                        : receiptPreview
                        ? 'border-teal-500 bg-teal-50/30'
                        : 'border-slate-300 hover:border-teal-500'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        handleFileChange(e);
                        setFormError(null);
                      }}
                      className="hidden"
                      id="receipt-upload"
                    />
                    <label htmlFor="receipt-upload" className="cursor-pointer block">
                      {receiptPreview ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileCheck className="w-8 h-8 text-teal-600" />
                          <div className="text-left">
                            <span className="text-sm font-bold text-slate-800 block">
                              Resit Berjaya Dipilih!
                            </span>
                            <span className="text-xs text-teal-600 font-medium">
                              Klik untuk tukar fail jika perlu
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                          <span className="text-sm font-bold text-slate-700 block">
                            Klik di sini untuk muat naik slip resit
                          </span>
                          <span className="text-xs text-slate-400">
                            Sokongan fail imej JPG, PNG atau PDF (Tangkapan skrin online banking)
                          </span>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Maklumat Bank untuk Pemulangan Deposit */}
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Maklumat Akaun Bank untuk Pemulangan Deposit Keselamatan (Pilihan)
                    </label>
                    <input
                      type="text"
                      placeholder="Cth: 1550 3225 4143 (Maybank) - Ahmad Farhan"
                      value={refundBankInfo}
                      onChange={(e) => setRefundBankInfo(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                    <p className="text-[11px] text-slate-500">
                      Deposit keselamatan akan dipindahkan semula ke akaun ini dalam tempoh 24 jam selepas check-out.
                    </p>
                  </div>

                  {/* Senarai Semak & Perakuan Syarat */}
                  <div className="mt-3 flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/70 border border-teal-200">
                    <input
                      type="checkbox"
                      id="terms-checklist-toggle"
                      checked={checklistAgreed}
                      onChange={(e) => setChecklistAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                    />
                    <label
                      htmlFor="terms-checklist-toggle"
                      className="text-xs text-slate-700 font-medium cursor-pointer select-none leading-relaxed"
                    >
                      Saya mengesahkan semua maklumat yang diberikan adalah betul serta bersetuju dengan syarat dan peraturan menginap di <b>JADI Homestay</b>.
                    </label>
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2 animate-bounce">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setBookingStep('SELECTING')}
                  className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
                >
                  Kembali ke Kalendar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-grow py-3.5 px-6 rounded-xl font-black text-sm text-white bg-teal-700 hover:bg-teal-800 shadow-lg shadow-teal-700/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Memproses Tempahan...'
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Hantar Tempahan & Bukti Bayaran
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS & WHATSAPP REDIRECT */}
        {bookingStep === 'SUCCESS' && createdBooking && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-teal-200 shadow-2xl p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
                Tempahan Berjaya Dihantar!
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Terima Kasih, {createdBooking.guest_name}!
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Unit Tempahan:{' '}
                <span className="font-extrabold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md">
                  {createdBooking.unit_name}
                </span>
                {' '}| Kod:{' '}
                <span className="font-mono font-bold text-slate-700">
                  {createdBooking.booking_code}
                </span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs sm:text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Unit Homestay:</span>
                <span className="font-bold text-teal-900">{createdBooking.unit_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tarikh Penginapan:</span>
                <span className="font-bold text-slate-800">
                  {createdBooking.check_in} hingga {createdBooking.check_out} ({createdBooking.nights_count} malam)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pilihan Bayaran:</span>
                <span className="font-bold text-slate-800">
                  {createdBooking.payment_type === 'DEPOSIT'
                    ? 'Bayaran Deposit Sahaja (Kunci Tarikh)'
                    : 'Bayaran Penuh (Selesai)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jumlah Dibayar Sekarang:</span>
                <span className="font-bold text-teal-800">
                  RM {createdBooking.amount_paid.toFixed(2)}
                </span>
              </div>
              {createdBooking.payment_type === 'DEPOSIT' && (
                <div className="flex justify-between text-amber-700 bg-amber-50 p-2 rounded-lg font-bold">
                  <span>Baki Perlu Dibayar Semasa Check-in:</span>
                  <span>RM {createdBooking.balance_due.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Jumlah Keseluruhan Tempahan:</span>
                <span className="font-bold text-slate-700">
                  RM {createdBooking.total_amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-amber-600">Menunggu Pengesahan Pemilik</span>
              </div>
            </div>

            {/* Instant WhatsApp Action Button */}
            <div className="space-y-3 pt-2">
              <a
                href={generateOwnerBookingWhatsAppUrl(createdBooking, settings.owner_phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-black text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
              >
                <Phone className="w-5 h-5" />
                Hantar Notifikasi Terus ke WhatsApp Pemilik
              </a>
              <p className="text-xs text-slate-400">
                Pautan di atas akan membuka WhatsApp anda dan menghantar butiran tempahan berserta nama unit terus kepada pengurus homestay.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setBookingStep('SELECTING');
                  setCheckInDate(null);
                  setCheckOutDate(null);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                ← Buat Tempahan Lain
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
