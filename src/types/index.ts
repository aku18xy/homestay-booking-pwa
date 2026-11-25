export type BookingStatus =
  | 'LOCKED'
  | 'PENDING_VERIFICATION'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'REJECTED';

export interface GalleryItem {
  id: number;
  title: string;
  category: 'kolam' | 'bilik' | 'ruang' | 'dapur' | 'luaran';
  imageUrl: string;
  description: string;
}

export interface AmenityItem {
  name: string;
  desc: string;
  iconName: 'Waves' | 'Wind' | 'Wifi' | 'Tv' | 'Flame' | 'Droplets' | 'UtensilsCrossed' | 'Car' | 'Shirt' | 'Coffee' | 'Shield' | 'Sparkles' | 'TreePine' | 'Bath';
}

export interface HomestayUnit {
  id: string;
  name: string;
  slug: string;
  badge?: string;
  tagline: string;
  description: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  base_weekday_rate: number;
  weekend_rate: number;
  security_deposit: number;
  featured_image: string;
  gallery: GalleryItem[];
  amenities: AmenityItem[];
  blocked_dates: string[]; // YYYY-MM-DD
}

export interface Booking {
  id: string;
  booking_code: string;
  unit_id: string;
  unit_name: string;
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
  payment_type: 'DEPOSIT' | 'FULL';
  amount_paid: number;
  balance_due: number;
  payment_method: string;
  payment_receipt_url?: string;
  ic_number?: string;
  guest_address?: string;
  stay_purpose?: string;
  refund_bank_info?: string;
  ic_image_url?: string;
  status: BookingStatus;
  lock_expires_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BlockedDate {
  id: string;
  unit_id: string; // Mengaitkan tarikh kunci kepada unit khusus
  date: string; // YYYY-MM-DD
  reason?: string;
  created_at: string;
}

export interface PricingRule {
  id: string;
  unit_id?: string;
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
  check_in_time: string;
  check_out_time: string;
  admin_pin: string;
  google_sheets_url?: string;
  google_sheets_webhook_url?: string;
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
