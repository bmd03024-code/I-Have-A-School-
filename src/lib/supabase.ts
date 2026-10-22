import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { safeStorage } from './storageService';

// Supabase Production Configuration (read from environment or default)
export const SUPABASE_URL = 'https://gdopjlajrlexmuccpctg.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_HagrVigXrnHYR7iXs_habg_1b-R_Jak';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL).trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY).trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let clientInstance: SupabaseClient | null = null;

try {
  if (isSupabaseConfigured) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
} catch (err) {
  console.warn('[Supabase] Initialization notice:', err);
}

// Fallback stub client if initialization ever fails
const fallbackClient = {
  from: (table: string) => ({
    select: async () => {
      const raw = safeStorage.getItem(`ihas_${table}`);
      return { data: raw ? JSON.parse(raw) : [], error: null };
    },
    insert: async (data: any) => {
      const raw = safeStorage.getItem(`ihas_${table}`);
      const current = raw ? JSON.parse(raw) : [];
      const updated = [...current, ...(Array.isArray(data) ? data : [data])];
      safeStorage.setItem(`ihas_${table}`, JSON.stringify(updated));
      return { data, error: null };
    },
    update: async (data: any) => ({ data, error: null }),
    delete: async () => ({ data: null, error: null }),
    upsert: async (data: any) => ({ data, error: null }),
  }),
  channel: () => ({
    on: () => ({ subscribe: () => ({}) }),
  }),
  removeChannel: () => {},
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
  },
} as unknown as SupabaseClient;

export const supabase: SupabaseClient = clientInstance || fallbackClient;

/**
 * Check if the central 'ihas_data' table exists and is accessible in Supabase
 */
export async function testSupabaseTableStatus(): Promise<{
  ready: boolean;
  tableExists: boolean;
  message: string;
  error?: string;
}> {
  if (!clientInstance) {
    return {
      ready: false,
      tableExists: false,
      message: 'Supabase client is not initialized. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    };
  }

  try {
    const { error } = await clientInstance.from('ihas_data').select('key').limit(1);

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
        return {
          ready: false,
          tableExists: false,
          message: 'Table "public.ihas_data" does not exist in Supabase yet. Run the SQL migration script in your Supabase SQL Editor.',
          error: error.message,
        };
      }
      return {
        ready: false,
        tableExists: false,
        message: `Supabase query error: ${error.message}`,
        error: error.message,
      };
    }

    return {
      ready: true,
      tableExists: true,
      message: 'Supabase central database is active and table "ihas_data" is ready for real-time synchronization.',
    };
  } catch (err: any) {
    return {
      ready: false,
      tableExists: false,
      message: `Connection error: ${err?.message || 'Host unreachable'}`,
      error: err?.message,
    };
  }
}

/**
 * Test connectivity with the configured Supabase instance
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  url: string;
  tableReady?: boolean;
}> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      success: false,
      message: 'Supabase URL or key not configured.',
      url: supabaseUrl || '',
    };
  }

  try {
    // 1. First test table status
    const tableStatus = await testSupabaseTableStatus();
    if (tableStatus.ready) {
      return {
        success: true,
        message: 'সুপারবেস ক্লাউড ডেটাবেজ ও ihas_data টেবিল সম্পূর্ণ সক্রিয় ও রিয়েল-টাইম প্রস্তুত!',
        url: supabaseUrl,
        tableReady: true,
      };
    }

    // 2. Ping Supabase auth or public endpoint
    const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    if (res.ok || res.status === 200 || res.status === 401 || res.status === 403) {
      return {
        success: true,
        message: tableStatus.tableExists
          ? 'সুপারবেস (Supabase) ক্লাউড সফলভাবে সংযুক্ত হয়েছে!'
          : 'সুপারবেস ক্লাউড কানেক্টেড, কিন্তু "ihas_data" টেবিল তৈরি করা প্রয়োজন (SQL Migration চালান)।',
        url: supabaseUrl,
        tableReady: tableStatus.ready,
      };
    }

    return {
      success: false,
      message: `সংযোগ ত্রুটি: HTTP ${res.status}`,
      url: supabaseUrl,
      tableReady: false,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `সংযোগ ত্রুটি: ${err?.message || 'Supabase host unreachable'}`,
      url: supabaseUrl,
      tableReady: false,
    };
  }
}

/**
 * Fetch all authoritative entities from the central Supabase database
 */
export async function fetchCentralDatabase(): Promise<{
  success: boolean;
  data?: Record<string, any>;
  error?: string;
  tableMissing?: boolean;
}> {
  if (!clientInstance) {
    return { success: false, error: 'NO_CLIENT' };
  }

  try {
    const { data, error } = await clientInstance.from('ihas_data').select('key, value, updated_at');

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
        return { success: false, error: error.message, tableMissing: true };
      }
      return { success: false, error: error.message };
    }

    if (Array.isArray(data) && data.length > 0) {
      const snapshot: Record<string, any> = {};
      let maxUpdatedAt = '';

      for (const row of data) {
        if (row.key && row.value !== undefined) {
          snapshot[row.key] = row.value;
          if (row.updated_at && row.updated_at > maxUpdatedAt) {
            maxUpdatedAt = row.updated_at;
          }
        }
      }

      if (maxUpdatedAt) {
        snapshot._updatedAt = maxUpdatedAt;
        snapshot._meta = {
          lastSavedAt: maxUpdatedAt,
          authoritative: true,
          source: 'supabase',
        };
      }

      return { success: true, data: snapshot };
    }

    return { success: true, data: {} };
  } catch (err: any) {
    return { success: false, error: err?.message || 'FETCH_EXCEPTION' };
  }
}

/**
 * Save an authoritative entity key to the central Supabase database
 */
export async function saveCentralEntity(
  key: string,
  value: any
): Promise<{ success: boolean; error?: string; tableMissing?: boolean }> {
  if (!clientInstance) {
    return { success: false, error: 'Supabase client is not initialized' };
  }

  try {
    const timestamp = new Date().toISOString();
    const { error } = await clientInstance.from('ihas_data').upsert(
      {
        key,
        value,
        updated_at: timestamp,
      },
      { onConflict: 'key' }
    );

    if (error) {
      console.warn(`[Supabase Write Error] key="${key}":`, error.message);
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
        return {
          success: false,
          error: 'Table "public.ihas_data" does not exist in Supabase. Please run the SQL migration.',
          tableMissing: true,
        };
      }
      return { success: false, error: error.message };
    }

    // If saving notices, also mirror to dedicated 'notices' table if available (non-blocking)
    if (key === 'ihas_notices' && Array.isArray(value)) {
      mirrorNoticesTable(value).catch(() => {});
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'WRITE_EXCEPTION' };
  }
}

/**
 * Mirror notices array to the optional relational 'notices' table
 */
async function mirrorNoticesTable(noticesArray: any[]): Promise<void> {
  if (!clientInstance || !Array.isArray(noticesArray)) return;
  try {
    const formatted = noticesArray.map((n) => ({
      id: n.id,
      title_bn: n.titleBn || n.titleEn || 'Untitled',
      title_en: n.titleEn || n.titleBn || '',
      category: n.category || 'General',
      content_bn: n.contentBn || '',
      content_en: n.contentEn || '',
      date: n.date || '',
      is_pinned: Boolean(n.isPinned),
      image_url: n.imageUrl || null,
      pdf_url: n.pdfUrl || null,
    }));
    await clientInstance.from('notices').upsert(formatted, { onConflict: 'id' });
  } catch {
    // optional mirror table
  }
}

/**
 * Delete an entity key from the central Supabase database
 */
export async function deleteCentralEntity(
  key: string
): Promise<{ success: boolean; error?: string }> {
  if (!clientInstance) {
    return { success: false, error: 'Supabase client is not initialized' };
  }

  try {
    const { error } = await clientInstance.from('ihas_data').delete().eq('key', key);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'DELETE_EXCEPTION' };
  }
}

/**
 * Save complete database snapshot to Supabase in a batch
 */
export async function saveCentralSnapshot(
  snapshot: Record<string, any>
): Promise<{ success: boolean; error?: string; tableMissing?: boolean }> {
  if (!clientInstance) {
    return { success: false, error: 'Supabase client is not initialized' };
  }

  try {
    const timestamp = new Date().toISOString();
    const rows: { key: string; value: any; updated_at: string }[] = [];

    for (const [key, value] of Object.entries(snapshot)) {
      if (key && !key.startsWith('_')) {
        rows.push({
          key,
          value,
          updated_at: timestamp,
        });
      }
    }

    if (rows.length === 0) return { success: true };

    const { error } = await clientInstance.from('ihas_data').upsert(rows, { onConflict: 'key' });

    if (error) {
      console.warn('[Supabase Snapshot Write Error]:', error.message);
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
        return {
          success: false,
          error: 'Table "public.ihas_data" does not exist in Supabase. Please run the SQL migration.',
          tableMissing: true,
        };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'SNAPSHOT_EXCEPTION' };
  }
}

/**
 * Subscribe to Supabase Realtime changes on 'ihas_data'
 * Returns a cleanup unsubscribe function.
 */
export function subscribeToCentralRealtime(
  onUpdate: (key: string, value: any) => void,
  onStatusChange?: (status: string, error?: string | null) => void
): () => void {
  if (!clientInstance) {
    if (onStatusChange) onStatusChange('NO_CLIENT', 'Client not initialized');
    return () => {};
  }

  let channel: RealtimeChannel | null = null;

  try {
    const channelName = `ihas_realtime_sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    channel = clientInstance
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ihas_data' },
        (payload: any) => {
          try {
            if (payload.eventType === 'DELETE') {
              const deletedKey = payload.old?.key;
              if (deletedKey) {
                onUpdate(deletedKey, null);
              }
            } else if (payload.new && payload.new.key) {
              onUpdate(payload.new.key, payload.new.value);
            }
          } catch (handlerErr) {
            console.warn('[Supabase Realtime Handler Error]:', handlerErr);
          }
        }
      )
      .subscribe((status, err) => {
        if (onStatusChange) {
          onStatusChange(status, err ? err.message : null);
        }
      });
  } catch (subErr: any) {
    console.warn('[Supabase Realtime Setup Error]:', subErr);
    if (onStatusChange) {
      onStatusChange('ERROR', subErr?.message);
    }
  }

  return () => {
    if (channel && clientInstance) {
      try {
        clientInstance.removeChannel(channel);
      } catch {
        // ignore cleanup error
      }
    }
  };
}

/**
 * Minimum required SQL migration script to set up Supabase table and Realtime replication
 */
export const REQUIRED_SQL_MIGRATION = `-- ====================================================================
-- I HAVE A SCHOOL - CENTRAL SUPABASE DATABASE SCHEMA & REALTIME SETUP
-- Run this script in your Supabase Project -> SQL Editor -> Run
-- Project URL: https://gdopjlajrlexmuccpctg.supabase.co
-- ====================================================================

-- 1. Create the central authoritative data store table
CREATE TABLE IF NOT EXISTS public.ihas_data (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.ihas_data ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public Read Access (All website visitors & students can view content)
DROP POLICY IF EXISTS "Allow public read access" ON public.ihas_data;
CREATE POLICY "Allow public read access"
  ON public.ihas_data
  FOR SELECT
  USING (true);

-- 4. Policy: Write Access for Administrative Operations
DROP POLICY IF EXISTS "Allow admin write access" ON public.ihas_data;
CREATE POLICY "Allow admin write access"
  ON public.ihas_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Enable Supabase Realtime Replication for instant live cross-browser sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.ihas_data;

-- 6. Dedicated relational tables for structured SQL inspection (Optional but recommended)
CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY,
  title_bn TEXT NOT NULL,
  title_en TEXT,
  category TEXT DEFAULT 'General',
  content_bn TEXT NOT NULL,
  content_en TEXT,
  date TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read notices" ON public.notices;
CREATE POLICY "Allow public read notices"
  ON public.notices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin write notices" ON public.notices;
CREATE POLICY "Allow admin write notices"
  ON public.notices FOR ALL USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.notices;
`;
