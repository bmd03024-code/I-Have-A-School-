-- ====================================================================
-- I HAVE A SCHOOL - CENTRAL SUPABASE DATABASE SCHEMA & REALTIME SETUP
-- Run this script in your Supabase Project -> SQL Editor -> Run
-- Project: https://gdopjlajrlexmuccpctg.supabase.co
-- ====================================================================

-- 1. Create the central authoritative data store table
CREATE TABLE IF NOT EXISTS public.ihas_data (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.ihas_data ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public Read Access (All website visitors & students can view content)
DROP POLICY IF EXISTS "Allow public read access" ON public.ihas_data;
CREATE POLICY "Allow public read access"
  ON public.ihas_data
  FOR SELECT
  USING (true);

-- 4. Policy: Write Access for Administrative Operations
DROP POLICY IF EXISTS "Allow admin write access" ON public.ihas_data;
CREATE POLICY "Allow admin write access"
  ON public.ihas_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Enable Supabase Realtime Replication for instant live cross-browser sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.ihas_data;

-- 6. Dedicated relational tables for structured SQL inspection (Optional but recommended)
CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY,
  title_bn TEXT NOT NULL,
  title_en TEXT,
  category TEXT DEFAULT 'General',
  content_bn TEXT NOT NULL,
  content_en TEXT,
  date TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read notices" ON public.notices;
CREATE POLICY "Allow public read notices"
  ON public.notices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin write notices" ON public.notices;
CREATE POLICY "Allow admin write notices"
  ON public.notices FOR ALL USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.notices;
