-- Migration: Support unclaimed stores added from the map
-- Run this in your Supabase SQL Editor

-- 1. Relax name length constraint (store names from OpenStreetMap can be short)
ALTER TABLE stores DROP CONSTRAINT IF EXISTS stores_name_check;
ALTER TABLE stores ADD CONSTRAINT stores_name_check CHECK (char_length(name) >= 2 AND char_length(name) <= 100);

-- 2. Make email optional (unclaimed stores have no email)
ALTER TABLE stores ALTER COLUMN email DROP NOT NULL;
-- Also make email unique only when provided
ALTER TABLE stores DROP CONSTRAINT IF EXISTS stores_email_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_stores_email_unique ON stores (email) WHERE email IS NOT NULL;

-- 3. Add lat/lng columns if not present
ALTER TABLE stores ADD COLUMN IF NOT EXISTS lat NUMERIC(10, 7);
ALTER TABLE stores ADD COLUMN IF NOT EXISTS lng NUMERIC(10, 7);

-- 4. Add osm_id to prevent duplicates from OpenStreetMap data
ALTER TABLE stores ADD COLUMN IF NOT EXISTS osm_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_stores_osm_id ON stores (osm_id) WHERE osm_id IS NOT NULL;

-- 5. Add a store_type column (e.g. 'claimed', 'unclaimed')
ALTER TABLE stores ADD COLUMN IF NOT EXISTS store_type VARCHAR(20) NOT NULL DEFAULT 'claimed';

-- 6. Recreate the view to include lat, lng, osm_id, store_type
DROP VIEW IF EXISTS stores_with_rating;
CREATE VIEW stores_with_rating AS
SELECT
  s.*,
  COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) AS average_rating,
  COUNT(r.id) AS total_ratings
FROM stores s
LEFT JOIN ratings r ON r.store_id = s.id
GROUP BY s.id;
