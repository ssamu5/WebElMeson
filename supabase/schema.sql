-- ============================================================
-- EL MESÓN SMASHBURGERS — Schema completo
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- TABLAS
-- ---------------------------------------------------------------

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(6,2) not null,
  category text not null check (category in ('raciones','smash_10','smash_13','postres')),
  is_available boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  image_url text,
  allergens text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists burger_del_mes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(6,2) not null,
  image_url text,
  story text,
  is_active boolean not null default false,
  month_year text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists foodtruck_locations (
  id uuid primary key default gen_random_uuid(),
  event_date date not null unique,
  location_name text not null,
  town text not null,
  address text,
  maps_url text,
  start_time time not null default '20:00',
  end_time time not null default '23:00',
  special_note text,
  is_confirmed boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists today_special (
  id uuid primary key default gen_random_uuid(),
  special_date date not null unique,
  featured_burgers text[],
  special_message text,
  extra_note text,
  updated_at timestamptz default now()
);

create table if not exists notification_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  towns text[] not null,
  is_active boolean not null default true,
  confirmed boolean not null default false,
  confirm_token text,
  subscribed_at timestamptz default now()
);

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt_text text,
  caption text,
  category text not null default 'todo',
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz default now()
);

-- UPDATED_AT trigger
-- ---------------------------------------------------------------
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists set_updated_at on menu_items;
create trigger set_updated_at before update on menu_items
  for each row execute function update_updated_at();

drop trigger if exists set_updated_at on burger_del_mes;
create trigger set_updated_at before update on burger_del_mes
  for each row execute function update_updated_at();

drop trigger if exists set_updated_at on foodtruck_locations;
create trigger set_updated_at before update on foodtruck_locations
  for each row execute function update_updated_at();

drop trigger if exists set_updated_at on today_special;
create trigger set_updated_at before update on today_special
  for each row execute function update_updated_at();

-- RLS (Row Level Security)
-- ---------------------------------------------------------------
alter table menu_items enable row level security;
alter table burger_del_mes enable row level security;
alter table foodtruck_locations enable row level security;
alter table today_special enable row level security;
alter table notification_subscribers enable row level security;
alter table gallery_images enable row level security;

-- Lectura pública para tablas de contenido
create policy "public_read_menu" on menu_items for select using (true);
create policy "public_read_burger_mes" on burger_del_mes for select using (true);
create policy "public_read_locations" on foodtruck_locations for select using (true);
create policy "public_read_today" on today_special for select using (true);
create policy "public_read_gallery" on gallery_images for select using (true);

-- Suscriptores: solo insertar (sin leer datos ajenos)
create policy "public_insert_subscribers" on notification_subscribers for insert with check (true);
create policy "public_update_confirm" on notification_subscribers for update using (true);

-- REALTIME
-- ---------------------------------------------------------------
alter publication supabase_realtime add table menu_items;
alter publication supabase_realtime add table burger_del_mes;
alter publication supabase_realtime add table foodtruck_locations;
alter publication supabase_realtime add table today_special;
