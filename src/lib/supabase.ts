import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export type Recipe = {
  id: string;
  name: string;
  recipe_text: string | null;
  created_at: string;
};

export type RecipeImage = {
  id: string;
  recipe_id: string;
  storage_path: string;
  created_at: string;
};

export type Contribution = {
  id: string;
  item_id: string;
  item_title: string;
  name: string | null;
  message: string | null;
  amount: number;
  currency: string;
  source: "monzo";
  status: "pending" | "confirmed" | "self_reported";
  created_at: string;
};
