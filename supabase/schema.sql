-- =====================================================================
-- SISTEM TEMPAHAN HOMESTAY (CUSTOM PWA) - MULTI-UNIT DATABASE SCHEMA
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. HOMESTAY GENERAL SETTINGS
CREATE TABLE IF NOT EXISTS homestay_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    homestay_name TEXT NOT NULL DEFAULT 'D''Seri Bayu Homestay & Chalet',
    tagline TEXT DEFAULT 'Koleksi Penginapan Percutian Keluarga & Acara Santai',
    address TEXT DEFAULT 'No. 18, Jalan Impian Murni 2, Saujana Impian, 43000 Kajang, Selangor',
    waze_url TEXT DEFAULT 'https://waze.com/ul/hw2834j8v3',
    google_maps_url TEXT DEFAULT 'https://maps.google.com/?q=Saujana+Impian+Kajang',
    owner_phone TEXT NOT NULL DEFAULT '60123456789',
    owner_name TEXT NOT NULL DEFAULT 'En. Razak & Pn. Aisyah',
    bank_name TEXT NOT NULL DEFAULT 'Maybank',
    bank_account_no TEXT NOT NULL DEFAULT '562834019283',
    bank_account_holder TEXT NOT NULL DEFAULT 'D SERI BAYU ENTERPRISE',
    duitnow_qr_url TEXT DEFAULT 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DuitNow-DSeriBayu-562834019283',
    check_in_time TEXT NOT NULL DEFAULT '3:00 PM',
    check_out_time TEXT NOT NULL DEFAULT '12:00 PM',
    admin_pin TEXT NOT NULL DEFAULT '8899',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOMESTAY UNITS TABLE (Pelbagai Unit di Bawah Satu Pemilik)
CREATE TABLE IF NOT EXISTS homestay_units (
    id TEXT PRIMARY KEY, -- Cth: 'unit-villa-bayu', 'unit-chalet-damai'
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    badge TEXT,
    tagline TEXT,
    description TEXT,
    max_guests INTEGER NOT NULL DEFAULT 8,
    bedrooms INTEGER NOT NULL DEFAULT 3,
    bathrooms INTEGER NOT NULL DEFAULT 2,
    base_weekday_rate NUMERIC(10, 2) NOT NULL DEFAULT 250.00,
    weekend_rate NUMERIC(10, 2) NOT NULL DEFAULT 350.00,
    security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    featured_image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    amenities JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BOOKINGS TABLE (Mengaitkan Tempahan dengan Unit Tertentu)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT UNIQUE NOT NULL,
    unit_id TEXT NOT NULL REFERENCES homestay_units(id) ON DELETE CASCADE,
    unit_name TEXT NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_bookings_unit_dates ON bookings (unit_id, check_in, check_out, status);

-- 4. BLOCKED DATES TABLE (Kunci Tarikh Per-Unit)
CREATE TABLE IF NOT EXISTS blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id TEXT NOT NULL REFERENCES homestay_units(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reason TEXT DEFAULT 'OFFLINE_BOOKING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (unit_id, date) -- Memastikan tiada duplikasi kunci bagi unit sama
);

CREATE INDEX IF NOT EXISTS idx_blocked_dates_unit_date ON blocked_dates (unit_id, date);

-- 5. PRICING RULES (Kadar Puncak Cuti Umum)
CREATE TABLE IF NOT EXISTS pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id TEXT REFERENCES homestay_units(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    date_start DATE NOT NULL,
    date_end DATE NOT NULL,
    rate_per_night NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
