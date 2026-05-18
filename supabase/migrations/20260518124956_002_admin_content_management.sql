/*
  # Admin content management schema

  1. New Tables
    - `admin_uploads` — stores uploaded image metadata (URL, alt text, context)
      - `id` (uuid, primary key)
      - `url` (text, not null) — storage URL of the uploaded image
      - `alt` (text) — alt text for the image
      - `context` (text) — where the image is used (e.g. "menu", "hero", "sauna")
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `admin_uploads`
    - Public can read uploads (images need to display on the site)
    - Only authenticated users can insert/update/delete uploads

  3. Existing table changes
    - `site_content` already has RLS with public read and authenticated update
    - `inquiries` already has RLS with public insert and authenticated read

  4. Storage bucket
    - Create `uploads` storage bucket for image uploads
    - Public read access for images (they display on the public site)
    - Only authenticated users can upload
*/

-- Create admin_uploads table
CREATE TABLE IF NOT EXISTS admin_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  alt text DEFAULT '',
  context text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view uploads"
  ON admin_uploads FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated can insert uploads"
  ON admin_uploads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update uploads"
  ON admin_uploads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete uploads"
  ON admin_uploads FOR DELETE
  TO authenticated
  USING (true);

-- Add update policy for site_content (authenticated users can update)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_content' AND policyname = 'Authenticated can update site content'
  ) THEN
    CREATE POLICY "Authenticated can update site content"
      ON site_content FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: public read
CREATE POLICY "Public can view uploads bucket"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'uploads');

-- Storage policy: authenticated can upload
CREATE POLICY "Authenticated can upload to uploads bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'uploads');

-- Storage policy: authenticated can delete uploads
CREATE POLICY "Authenticated can delete from uploads bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'uploads');
