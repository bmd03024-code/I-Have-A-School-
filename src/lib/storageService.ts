// Robust IndexedDB & Real-Time Sync Service for I Have A School
// Pure Google Cloud architecture & local IndexedDB storage with zero Firebase/Firestore dependencies.

const DB_NAME = 'ihas_database';
const DB_VERSION = 2;
const CHANNEL_NAME = 'ihas_realtime_broadcast';

// BroadcastChannel for instant real-time sync across browser windows/tabs
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch {
  // Graceful fallback if unsupported
}

export const notifyRealtimeUpdate = (topic: string, data?: any) => {
  try {
    const payload = { topic, timestamp: Date.now(), data };
    if (broadcastChannel) {
      broadcastChannel.postMessage(payload);
    }
    // Also trigger custom window event for same-tab subscribers
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ihas-realtime', { detail: payload }));
      // Write ping timestamp to localStorage to guarantee native cross-tab/iframe 'storage' event fires
      try {
        localStorage.setItem('ihas_realtime_ping', JSON.stringify({ topic, timestamp: Date.now(), data }));
      } catch {
        // ignore storage errors
      }
    }
  } catch (err) {
    console.warn('Realtime broadcast error:', err);
  }
};

export const subscribeRealtimeUpdate = (callback: (topic: string, data?: any) => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (e: MessageEvent) => {
    if (e.data?.topic) {
      callback(e.data.topic, e.data.data);
    }
  };

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent;
    if (custom.detail?.topic) {
      callback(custom.detail.topic, custom.detail.data);
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'ihas_realtime_ping' && e.newValue) {
      try {
        const ping = JSON.parse(e.newValue);
        if (ping?.topic) {
          callback(ping.topic, ping.data);
        }
      } catch {
        // ignore
      }
    } else if (e.key && e.key.startsWith('ihas_')) {
      const topic = e.key.replace('ihas_', '');
      let parsed = null;
      try {
        parsed = e.newValue ? JSON.parse(e.newValue) : null;
      } catch {
        parsed = e.newValue;
      }
      callback(topic, parsed);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleMessage);
  }
  window.addEventListener('ihas-realtime', handleCustomEvent);
  window.addEventListener('storage', handleStorage);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('ihas-realtime', handleCustomEvent);
    window.removeEventListener('storage', handleStorage);
  };
};

// Open IndexedDB
export function openIhasDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const stores = [
        'settings',
        'slides',
        'courses',
        'students',
        'subjects',
        'exams',
        'results',
        'teachers',
        'videos',
        'notes',
        'notices',
        'routines',
        'chatbot_training',
        'dictionary',
        'quizzes',
        'google_cloud'
      ];

      stores.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generic get all items from an IndexedDB store
export async function getStoreItems<T>(storeName: string): Promise<T[]> {
  try {
    const db = await openIhasDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as T[]) || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback to localStorage if IndexedDB fails
    try {
      const raw = localStorage.getItem(`ihas_${storeName}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

// Generic save item to IndexedDB store
export async function saveStoreItem<T extends { id: string | number }>(
  storeName: string,
  item: T
): Promise<void> {
  try {
    const db = await openIhasDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // LocalStorage fallback
    try {
      const raw = localStorage.getItem(`ihas_${storeName}`);
      const items: any[] = raw ? JSON.parse(raw) : [];
      const index = items.findIndex((i) => i.id === item.id);
      if (index >= 0) {
        items[index] = item;
      } else {
        items.unshift(item);
      }
      localStorage.setItem(`ihas_${storeName}`, JSON.stringify(items));
    } catch (e) {
      console.warn('Fallback save failed:', e);
    }
  }

  notifyRealtimeUpdate(storeName, item);
}

// Generic delete item from IndexedDB store
export async function deleteStoreItem(storeName: string, id: string | number): Promise<void> {
  try {
    const db = await openIhasDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(`ihas_${storeName}`);
      if (raw) {
        const items = JSON.parse(raw).filter((i: any) => i.id !== id);
        localStorage.setItem(`ihas_${storeName}`, JSON.stringify(items));
      }
    } catch (e) {
      console.warn('Fallback delete failed:', e);
    }
  }

  notifyRealtimeUpdate(storeName, { deletedId: id });
}

// Convert uploaded file to Base64 Data URL (Images, PDFs, Videos)
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as string'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
