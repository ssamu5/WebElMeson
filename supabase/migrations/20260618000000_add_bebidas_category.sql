-- Add 'bebidas' value to menu_category enum
-- Postgres enums can only have values added (not removed) — IF NOT EXISTS requires PG 14+
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'bebidas'
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'menu_category')
  ) THEN
    ALTER TYPE menu_category ADD VALUE 'bebidas';
  END IF;
END$$;
