import { HomestaySettings, Booking, BlockedDate, PricingRule } from '@/types';

export const DEFAULT_SETTINGS: HomestaySettings = {
  id: '00000000-0000-0000-0000-000000000001',
  homestay_name: "D'Seri Bayu Homestay",
  tagline: "Percutian Impian Seisi Keluarga Bersama Kolam Renang Persendirian",
  address: "No. 18, Jalan Impian Murni 2, Saujana Impian, 43000 Kajang, Selangor",
  waze_url: "https://waze.com/ul/hw2834j8v3",
  google_maps_url: "https://maps.google.com/?q=Saujana+Impian+Kajang",
  owner_phone: "60123456789",
  owner_name: "En. Razak & Pn. Aisyah",
  bank_name: "Maybank",
  bank_account_no: "562834019283",
  bank_account_holder: "D SERI BAYU ENTERPRISE",
  duitnow_qr_url: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DuitNow-DSeriBayu-562834019283",
  base_weekday_rate: 250,
  weekend_rate: 350,
  security_deposit: 100,
  check_in_time: "3:00 PM",
  check_out_time: "12:00 PM",
  max_guests: 12,
  admin_pin: "8899",
};

export const INITIAL_BLOCKED_DATES: BlockedDate[] = [
  // Contoh tarikh yang telah ditempah / disekat
  {
    id: 'block-1',
    date: '2026-11-28',
    reason: 'OFFLINE_BOOKING',
    created_at: new Date().toISOString(),
  },
  {
    id: 'block-2',
    date: '2026-11-29',
    reason: 'OFFLINE_BOOKING',
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_PRICING_RULES: PricingRule[] = [
  {
    id: 'rule-school-holiday',
    name: 'Musim Cuti Persekolahan',
    date_start: '2026-12-18',
    date_end: '2027-01-02',
    rate_per_night: 400,
    is_active: true,
  },
];
