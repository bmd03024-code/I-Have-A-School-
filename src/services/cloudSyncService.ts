// Universal Open Cloud Real-Time Store Service
// Pure open REST & Server-Stream architecture with ZERO Firebase, ZERO Supabase, and ZERO Google Cloud dependencies.

import { UniversalCloudSyncConfig } from '../types';

export interface OpenCloudSyncResult {
  success: boolean;
  message: string;
  data?: any;
  updatedAt?: string;
  error?: string;
}

/**
 * Fetch latest database state from Universal Open Cloud Store or custom REST API
 */
export async function fetchOpenCloudData(config: UniversalCloudSyncConfig): Promise<OpenCloudSyncResult> {
  if (!config.enabled || !config.endpointUrl || !config.endpointUrl.trim()) {
    return {
      success: false,
      message: 'ক্লাউড স্টোর এন্ডপয়েন্ট কনফিগার করা নেই।'
    };
  }

  const cleanUrl = config.endpointUrl.trim();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache'
  };

  if (config.apiKey && config.apiKey.trim()) {
    headers['X-Master-Key'] = config.apiKey.trim();
    headers['Authorization'] = `Bearer ${config.apiKey.trim()}`;
  }

  try {
    const res = await fetch(`${cleanUrl}?_ts=${Date.now()}`, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!res.ok) {
      return {
        success: false,
        message: `ক্লাউড স্টোর থেকে ডেটা লোড ব্যর্থ হয়েছে (HTTP ${res.status})`,
        error: `HTTP ${res.status}: ${res.statusText}`
      };
    }

    const payload = await res.json();
    // JSONBin returns { record: ... }, nPoint returns direct object
    const finalData = payload.record || payload.data || payload;

    return {
      success: true,
      message: 'ক্লাউড স্টোর থেকে সফলভাবে সর্বশেষ ডেটা সংগৃহীত হয়েছে।',
      data: finalData,
      updatedAt: finalData._meta?.lastUpdated || finalData._updatedAt || new Date().toISOString()
    };
  } catch (err: any) {
    return {
      success: false,
      message: `ক্লাউড স্টোরে সংযোগ বিঘ্নিত: ${err.message || 'নেটওয়ার্ক এরর'}`,
      error: err.message
    };
  }
}

/**
 * Push database state to Universal Open Cloud Store
 */
export async function pushToOpenCloud(
  config: UniversalCloudSyncConfig,
  dataPayload: any
): Promise<OpenCloudSyncResult> {
  if (!config.enabled || !config.endpointUrl || !config.endpointUrl.trim()) {
    return {
      success: false,
      message: 'ক্লাউড স্টোর এন্ডপয়েন্ট কনফিগার করা নেই।'
    };
  }

  const cleanUrl = config.endpointUrl.trim();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  if (config.apiKey && config.apiKey.trim()) {
    headers['X-Master-Key'] = config.apiKey.trim();
    headers['Authorization'] = `Bearer ${config.apiKey.trim()}`;
  }

  try {
    const method = config.provider === 'npoint' ? 'POST' : 'PUT';
    const res = await fetch(cleanUrl, {
      method,
      headers,
      body: JSON.stringify(dataPayload)
    });

    if (!res.ok) {
      // Try POST if PUT fails
      if (method === 'PUT') {
        const retryRes = await fetch(cleanUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(dataPayload)
        });
        if (retryRes.ok) {
          return {
            success: true,
            message: 'ক্লাউড স্টোরে ডেটা সফলভাবে সংরক্ষিত হয়েছে!',
            updatedAt: new Date().toISOString()
          };
        }
      }
      return {
        success: false,
        message: `ক্লাউড স্টোরে পুশ ব্যর্থ হয়েছে (HTTP ${res.status})`,
        error: `HTTP ${res.status}: ${res.statusText}`
      };
    }

    return {
      success: true,
      message: 'ক্লাউড স্টোরে ডেটা সফলভাবে সংরক্ষিত হয়েছে!',
      updatedAt: new Date().toISOString()
    };
  } catch (err: any) {
    return {
      success: false,
      message: `ক্লাউড পুশ ব্যর্থ হয়েছে: ${err.message || 'অজানা ত্রুটি'}`,
      error: err.message
    };
  }
}

/**
 * Test connectivity to Universal Open Cloud Store
 */
export async function testOpenCloudConnection(config: UniversalCloudSyncConfig): Promise<{
  success: boolean;
  message: string;
  latencyMs?: number;
}> {
  if (!config.endpointUrl || !config.endpointUrl.trim()) {
    return {
      success: false,
      message: 'দয়া করে একটি সঠিক ক্লাউড এন্ডপয়েন্ট URL প্রদান করুন।'
    };
  }

  const start = Date.now();
  try {
    const res = await fetch(`${config.endpointUrl.trim()}?_ts=${Date.now()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });
    const latencyMs = Date.now() - start;

    if (res.ok) {
      return {
        success: true,
        message: `ক্লাউড স্টোর সফলভাবে কানেক্টেড! (রেসপন্স সময়: ${latencyMs}ms)`,
        latencyMs
      };
    } else {
      return {
        success: false,
        message: `সার্ভার রেসপন্স দিয়েছে HTTP ${res.status} (${res.statusText})`,
        latencyMs
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `কানেকশন ব্যর্থ: ${err.message || 'নেটওয়ার্ক এরর'}`
    };
  }
}
