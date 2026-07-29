import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Company = {
  id: string;
  name: string;
  sector: string | null;
  notes: string | null;
  ratings: Record<string, number>;
  created_at: string;
};

export type CompanyInput = {
  name: string;
  sector?: string | null;
  notes?: string | null;
  ratings?: Record<string, number>;
};
