export type BookingStatus =
  | 'LOCKED'
  | 'PENDING_VERIFICATION'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'REJECTED';

export interface Booking {
  id: string;
  booking_code: string;
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  guest_count: number;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  nights_count: number;
  base_amount: number;
  peak_surcharge: number;
  security_deposit: number;
  total_amount: number;
  payment_method: string;
  payment_receipt_url?: string;
  status: BookingStatus;
  lock_expires_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BlockedDate {
  id: string;
  date: string; // YYYY-MM-DD
  reason?: string;
  created_at: string;
}

export interface PricingRule {
  id: string;
  name: string;
  date_start: string; // YYYY-MM-DD
  date_end: string;   // YYYY-MM-DD
  rate_per_night: number;
  is_active: boolean;
}

export interface HomestaySettings {
  id: string;
  homestay_name: string;
  tagline: string;
  address: string;
  waze_url: string;
  google_maps_url: string;
  owner_phone: string;
  owner_name: string;
  bank_name: string;
  bank_account_no: string;
  bank_account_holder: string;
  duitnow_qr_url: string;
  base_weekday_rate: number;
  weekend_rate: number;
  security_deposit: number;
  check_in_time: string;
  check_out_time: string;
  max_guests: number;
  admin_pin: string;
}

export interface PriceBreakdown {
  nights: number;
  weekdayNights: number;
  weekendNights: number;
  weekdayTotal: number;
  weekendTotal: number;
  peakSurcharge: number;
  securityDeposit: number;
  total: number;
  dailyRates: {
    date: string;
    dayName: string;
    isWeekend: boolean;
    rate: number;
  }[];
}
