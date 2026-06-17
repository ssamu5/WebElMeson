export type MenuCategory = "raciones" | "smash_10" | "smash_13" | "postres" | "bebidas";

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: MenuCategory;
  is_available: boolean;
  is_featured: boolean;
  is_today_special: boolean;
  is_burger_of_month: boolean;
  burger_month_label: string | null;
  sort_order: number;
  image_url: string | null;
  allergens: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface FoodtruckLocation {
  id: string;
  start_date: string;
  end_date: string;
  event_name: string;
  address: string | null;
  maps_url: string | null;
  start_time: string;
  end_time: string;
  special_note: string | null;
  is_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationSubscriber {
  id: string;
  email: string;
  towns: string[];
  is_active: boolean;
  confirmed: boolean;
  confirm_token: string | null;
  subscribed_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt_text: string | null;
  caption: string | null;
  category: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  start_at: string;
  end_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type GalleryCategory = "todo" | "foodtruck" | "burgers" | "eventos";

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  raciones: "Raciones",
  smash_10: "Smash Burgers €10",
  smash_13: "Smash Burgers €13",
  postres: "Postres",
  bebidas: "Bebidas",
};
