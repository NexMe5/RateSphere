-- Add coordinates to stores
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS lat NUMERIC,
ADD COLUMN IF NOT EXISTS lng NUMERIC;

-- Create Haversine function for distance calculation (in kilometers)
CREATE OR REPLACE FUNCTION get_distance_km(
    lat1 NUMERIC,
    lon1 NUMERIC,
    lat2 NUMERIC,
    lon2 NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
    radius NUMERIC := 6371; -- Earth's radius in kilometers
    dlat NUMERIC;
    dlon NUMERIC;
    a NUMERIC;
    c NUMERIC;
BEGIN
    dlat := radians(lat2 - lat1);
    dlon := radians(lon2 - lon1);
    
    a := sin(dlat/2) * sin(dlat/2) +
         cos(radians(lat1)) * cos(radians(lat2)) *
         sin(dlon/2) * sin(dlon/2);
         
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    
    RETURN radius * c;
END;
$$ LANGUAGE plpgsql;

-- Update the view to include lat, lng and distance calculation support
DROP VIEW IF EXISTS stores_with_rating;

CREATE VIEW stores_with_rating AS
SELECT
  s.id,
  s.name,
  s.email,
  s.address,
  s.owner_id,
  s.lat,
  s.lng,
  s.created_at,
  s.updated_at,
  COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) AS average_rating,
  COUNT(r.id) AS total_ratings
FROM stores s
LEFT JOIN ratings r ON r.store_id = s.id
GROUP BY s.id, s.name, s.email, s.address, s.owner_id, s.lat, s.lng, s.created_at, s.updated_at;
