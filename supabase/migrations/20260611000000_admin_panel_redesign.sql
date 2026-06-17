-- ============================================================
-- Admin panel redesign migration
-- Run once in: https://supabase.com/dashboard/project/tefqnzplvbkbflecmiup/sql/new
-- ============================================================

-- 1. NEW COLUMNS ON menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_today_special boolean NOT NULL DEFAULT false;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_burger_of_month boolean NOT NULL DEFAULT false;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS burger_month_label text;

-- Only one burger of month at a time
CREATE UNIQUE INDEX IF NOT EXISTS menu_items_one_burger_of_month
  ON menu_items (is_burger_of_month) WHERE is_burger_of_month = true;

-- 2. MIGRATE active burger_del_mes → menu_items (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'burger_del_mes') THEN
    INSERT INTO menu_items (name, description, price, category, is_available, sort_order, image_url, is_burger_of_month, burger_month_label)
    SELECT b.name, b.description, b.price, 'smash_13', true,
           COALESCE((SELECT MAX(sort_order)+1 FROM menu_items WHERE category='smash_13'), 0),
           b.image_url, true, b.month_year
    FROM burger_del_mes b
    WHERE b.is_active = true
      AND NOT EXISTS (SELECT 1 FROM menu_items m WHERE m.name = b.name);

    UPDATE menu_items m
    SET is_burger_of_month = true, burger_month_label = b.month_year
    FROM burger_del_mes b
    WHERE b.is_active = true AND m.name = b.name AND m.is_burger_of_month = false;
  END IF;
END $$;

-- 3. RLS write policies for menu_items (admin writes via anon key; gate is Next.js cookie)
DROP POLICY IF EXISTS "admin_write_menu_items" ON menu_items;
CREATE POLICY "admin_write_menu_items" ON menu_items FOR ALL USING (true) WITH CHECK (true);

-- 4. FOODTRUCK LOCATIONS: rename event_date → start_date, add end_date, rename location_name → event_name, drop town
ALTER TABLE foodtruck_locations DROP CONSTRAINT IF EXISTS foodtruck_locations_event_date_key;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foodtruck_locations' AND column_name='event_date') THEN
    ALTER TABLE foodtruck_locations RENAME COLUMN event_date TO start_date;
  END IF;
END $$;

ALTER TABLE foodtruck_locations ADD COLUMN IF NOT EXISTS end_date date;
UPDATE foodtruck_locations SET end_date = start_date WHERE end_date IS NULL;
ALTER TABLE foodtruck_locations ALTER COLUMN end_date SET NOT NULL;
ALTER TABLE foodtruck_locations DROP CONSTRAINT IF EXISTS foodtruck_locations_date_range;
ALTER TABLE foodtruck_locations ADD CONSTRAINT foodtruck_locations_date_range CHECK (end_date >= start_date);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foodtruck_locations' AND column_name='location_name') THEN
    ALTER TABLE foodtruck_locations RENAME COLUMN location_name TO event_name;
  END IF;
END $$;

ALTER TABLE foodtruck_locations DROP COLUMN IF EXISTS town;

-- RLS write policy
DROP POLICY IF EXISTS "admin_write_foodtruck_locations" ON foodtruck_locations;
CREATE POLICY "admin_write_foodtruck_locations" ON foodtruck_locations FOR ALL USING (true) WITH CHECK (true);

-- 5. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_announcements ON announcements;
CREATE TRIGGER set_updated_at_announcements
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_announcements" ON announcements;
CREATE POLICY "public_read_announcements" ON announcements FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin_write_announcements" ON announcements;
CREATE POLICY "admin_write_announcements" ON announcements FOR ALL USING (true) WITH CHECK (true);

-- 6. STORAGE BUCKET for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', true)
  ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_menu_images" ON storage.objects;
CREATE POLICY "public_read_menu_images" ON storage.objects
  FOR SELECT USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "admin_write_menu_images" ON storage.objects;
CREATE POLICY "admin_write_menu_images" ON storage.objects
  FOR ALL USING (bucket_id = 'menu-images') WITH CHECK (bucket_id = 'menu-images');

-- 7. DROP OBSOLETE TABLES
DROP TABLE IF EXISTS today_special;
DROP TABLE IF EXISTS burger_del_mes;
