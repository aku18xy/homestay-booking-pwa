-- =====================================================================
-- SISTEM TEMPAHAN HOMESTAY (CUSTOM PWA) - DATABASE SCHEMA (SUPABASE)
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HOMESTAY SETTINGS TABLE (Konfigurasi Utama Pemilik)
CREATE TABLE IF NOT EXISTS homestay_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    homestay_name TEXT NOT NULL DEFAULT 'Seri Idaman Homestay',
    tagline TEXT DEFAULT 'Percutian Selesa, Nyaman & Mendamaikan Seisi Keluarga',
    address TEXT DEFAULT 'No. 12, Jalan Idaman 3, Taman Seri Idaman, 43000 Kajang, Selangor',
    waze_url TEXT DEFAULT 'https://waze.com/ul',
    google_maps_url TEXT DEFAULT 'https://maps.google.com',
    owner_phone TEXT NOT NULL DEFAULT '60123456789',
    owner_name TEXT NOT NULL DEFAULT 'Pengurus Homestay',
    bank_name TEXT NOT NULL DEFAULT 'Maybank',
    bank_account_no TEXT NOT NULL DEFAULT '123456789012',
    bank_account_holder TEXT NOT NULL DEFAULT 'SERI IDAMAN ENTERPRISE',
    duitnow_qr_url TEXT DEFAULT '/images/duitnow-sample.png',
    base_weekday_rate NUMERIC(10, 2) NOT NULL DEFAULT 250.00,
    weekend_rate NUMERIC(10, 2) NOT NULL DEFAULT 350.00,
    security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    check_in_time TEXT NOT NULL DEFAULT '3:00 PM',
    check_out_time TEXT NOT NULL DEFAULT '12:00 PM',
    max_guests INTEGER NOT NULL DEFAULT 10,
    admin_pin TEXT NOT NULL DEFAULT '8899',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Setting if empty
INSERT INTO homestay_settings (id) 
SELECT '00000000-0000-0000-0000-000000000001'::uuid
WHERE NOT EXISTS (SELECT 1 FROM homestay_settings);

-- 3. BOOKINGS TABLE (Jadual Tempahan Tetamu)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT UNIQUE NOT NULL,
    guest_name TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    guest_email TEXT,
    guest_count INTEGER NOT NULL DEFAULT 2,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    nights_count INTEGER NOT NULL,
    base_amount NUMERIC(10, 2) NOT NULL,
    peak_surcharge NUMERIC(10, 2) DEFAULT 0.00,
    security_deposit NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'DUITNOW_QR',
    payment_receipt_url TEXT,
    status TEXT NOT NULL DEFAULT 'LOCKED' CHECK (status IN ('LOCKED', 'PENDING_VERIFICATION', 'CONFIRMED', 'CANCELLED', 'REJECTED')),
    lock_expires_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for date queries to ensure rapid live calendar lookups
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings (check_in, check_out, status);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);

-- 4. BLOCKED DATES TABLE (Tarikh Dikunci Secara Manual oleh Pemilik)
CREATE TABLE IF NOT EXISTS blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    reason TEXT DEFAULT 'OFFLINE_BOOKING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blocked_dates_date ON blocked_dates (date);

-- 5. PRICING RULES (Kadar Puncak / Cuti Umum Khusus)
CREATE TABLE IF NOT EXISTS pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    date_start DATE NOT NULL,
    date_end DATE NOT NULL,
    rate_per_night NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STORAGE BUCKET FOR RECEIPTS
-- Note: Sila aktifkan bucket 'receipts' (public read-access for images or signed URLs)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', true) ON CONFLICT DO NOTHING;

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE homestay_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

-- Allow public read of settings, blocked dates & pricing
CREATE POLICY "Public read settings" ON homestay_settings FOR SELECT USING (true);
CREATE POLICY "Public read blocked dates" ON blocked_dates FOR SELECT USING (true);
CREATE POLICY "Public read pricing rules" ON pricing_rules FOR SELECT USING (true);

-- Allow public to create booking & view confirmed/locked dates
CREATE POLICY "Public create booking" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read booking calendar status" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public update booking receipt" ON bookings FOR UPDATE USING (true);
