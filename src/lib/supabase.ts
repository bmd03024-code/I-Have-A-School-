import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Safe Supabase client or graceful local fallback
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: (table: string) => ({
        select: async () => {
          const raw = localStorage.getItem(`ihas_${table}`);
          return { data: raw ? JSON.parse(raw) : [], error: null };
        },
        insert: async (data: any) => {
          const raw = localStorage.getItem(`ihas_${table}`);
          const current = raw ? JSON.parse(raw) : [];
          const updated = [...current, ...(Array.isArray(data) ? data : [data])];
          localStorage.setItem(`ihas_${table}`, JSON.stringify(updated));
          return { data, error: null };
        },
        update: async (data: any) => ({ data, error: null }),
        delete: async () => ({ data: null, error: null }),
      }),
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
    };
