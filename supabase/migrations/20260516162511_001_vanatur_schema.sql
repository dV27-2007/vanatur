/*
  # VANATUR Database Schema

  1. New Tables
    - `site_content`
      - `content_key` (text, primary key) - Unique identifier for content blocks
      - `payload` (jsonb, not null) - Flexible JSON content storage
      - `updated_at` (timestamptz, not null, default now()) - Last update timestamp
    - `inquiries`
      - `id` (text, primary key) - Unique inquiry identifier
      - `created_at` (timestamptz, not null) - Submission timestamp
      - `request_type` (text, not null) - Type of request (restaurant, event, suite, etc.)
      - `name` (text, not null) - Submitter name
      - `phone` (text, not null) - Contact phone
      - `email` (text, not null, default '') - Contact email
      - `guests` (integer, nullable) - Number of guests
      - `desired_date` (text, not null, default '') - Preferred date
      - `space` (text, not null, default '') - Preferred space/venue
      - `source_page` (text, not null, default '') - Page the inquiry came from
      - `message` (text, not null, default '') - Additional message

  2. Indexes
    - `inquiries_created_at_idx` on `inquiries(created_at DESC)` for efficient listing

  3. Security
    - RLS enabled on both tables
    - `site_content`: anyone can read, only authenticated admins can write
    - `inquiries`: anyone can insert, only authenticated admins can read
*/

CREATE TABLE IF NOT EXISTS site_content (
  content_key TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL,
  request_type TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  guests INTEGER NULL,
  desired_date TEXT NOT NULL DEFAULT '',
  space TEXT NOT NULL DEFAULT '',
  source_page TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS inquiries_created_at_idx
  ON inquiries (created_at DESC);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- site_content: public read, admin write
CREATE POLICY "Public can read site content"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert site content"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update site content"
  ON site_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- inquiries: public insert, admin read
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (true);
