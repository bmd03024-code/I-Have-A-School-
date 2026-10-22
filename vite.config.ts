import { defineConfig, loadEnv, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import fs from 'node:fs';
import path from 'node:path';

// Set of active SSE client responses for instant sub-100ms real-time broadcasting
const sseClients = new Set<any>();
let heartbeatTimer: NodeJS.Timeout | null = null;

let cachedDatabase: Record<string, any> = {};
let writeQueue: Promise<any> = Promise.resolve();

function getOrLoadDatabase(): Record<string, any> {
  if (Object.keys(cachedDatabase).length > 0) {
    return cachedDatabase;
  }
  const targets = [
    path.resolve(process.cwd(), 'src/data/liveData.json'),
    path.resolve(process.cwd(), 'data/ihas_live_database.json'),
    path.resolve(process.cwd(), 'public/liveData.json')
  ];
  for (const t of targets) {
    if (fs.existsSync(t)) {
      try {
        const raw = fs.readFileSync(t, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          cachedDatabase = parsed;
          return cachedDatabase;
        }
      } catch {
        // ignore parse errors and try next
      }
    }
  }
  cachedDatabase = {};
  return cachedDatabase;
}

function queueSaveDatabase(data: Record<string, any>) {
  cachedDatabase = { ...getOrLoadDatabase(), ...data };
  const task = async () => {
    try {
      const jsonString = JSON.stringify(cachedDatabase, null, 2);
      const dataFilePath = path.resolve(process.cwd(), 'src/data/liveData.json');
      const publicDataFilePath = path.resolve(process.cwd(), 'public/liveData.json');
      const rootDataFilePath = path.resolve(process.cwd(), 'data/ihas_live_database.json');

      const srcDir = path.dirname(dataFilePath);
      if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
      await fs.promises.writeFile(dataFilePath, jsonString, 'utf-8');

      try {
        const pubDir = path.dirname(publicDataFilePath);
        if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
        await fs.promises.writeFile(publicDataFilePath, jsonString, 'utf-8');
      } catch {
        // ignore public write error
      }

      try {
        const rootDir = path.dirname(rootDataFilePath);
        if (!fs.existsSync(rootDir)) fs.mkdirSync(rootDir, { recursive: true });
        await fs.promises.writeFile(rootDataFilePath, jsonString, 'utf-8');
      } catch {
        // ignore data write error
      }
    } catch (err) {
      console.error('[CodeSync Write Error]:', err);
    }
  };
  writeQueue = writeQueue.then(task, task);
  return writeQueue;
}

// Plugin to automatically sync and write admin changes directly into codebase and broadcast real-time updates
function codeSyncPlugin() {
  return {
    name: 'code-sync-plugin',
    configureServer(server: any) {
      if (!heartbeatTimer) {
        heartbeatTimer = setInterval(() => {
          for (const client of sseClients) {
            try {
              client.write(': ping\n\n');
            } catch {
              sseClients.delete(client);
            }
          }
        }, 15000);
        if (typeof heartbeatTimer.unref === 'function') {
          heartbeatTimer.unref();
        }
      }

      // 1. Live SSE Stream endpoint for all visitor browsers and open tabs
      server.middlewares.use('/api/live-stream', (req: any, res: any) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (typeof res.flushHeaders === 'function') {
          res.flushHeaders();
        }

        sseClients.add(res);
        res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

        req.on('close', () => {
          sseClients.delete(res);
        });
      });

      // 2. Direct Live Data endpoint with strict zero-cache headers
      server.middlewares.use('/api/live-data', (req: any, res: any) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        const db = getOrLoadDatabase();
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(db));
      });

      // 3. Sync to Code (POST & GET) with serialized multi-file persistence and SSE broadcast
      server.middlewares.use('/api/sync-to-code', (req: any, res: any) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const db = getOrLoadDatabase();
              const timestamp = new Date().toISOString();
              let updated: Record<string, any> = {};

              // Merge single key updates or full snapshots safely without dropping other keys
              if (payload.snapshot && typeof payload.snapshot === 'object') {
                updated = { 
                  ...db, 
                  ...payload.snapshot, 
                  _updatedAt: timestamp,
                  _meta: {
                    ...(db._meta || {}),
                    ...(payload.snapshot._meta || {}),
                    authoritative: true,
                    lastSavedAt: timestamp,
                    syncedBy: 'Admin Control Panel Auto Engine'
                  }
                };
              } else if (payload.key) {
                updated = {
                  ...db,
                  [payload.key]: payload.data,
                  _updatedAt: timestamp,
                  _meta: {
                    ...(db._meta || {}),
                    authoritative: true,
                    lastSavedAt: timestamp,
                    lastUpdatedKey: payload.key,
                    syncedBy: 'Admin Control Panel Auto Engine'
                  }
                };
              } else {
                updated = { ...db, ...payload, _updatedAt: timestamp };
              }

              queueSaveDatabase(updated);

              // Broadcast instant SSE event to all connected visitor browsers
              const broadcastPayload = `data: ${JSON.stringify({ type: 'database_update', data: updated, timestamp })}\n\n`;
              for (const client of sseClients) {
                try {
                  client.write(broadcastPayload);
                } catch {
                  sseClients.delete(client);
                }
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ 
                success: true, 
                message: 'Admin changes written directly to codebase and broadcasted live to all websites',
                updatedAt: timestamp
              }));
            } catch (err: any) {
              console.error('[CodeSync Error]:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else if (req.method === 'GET' || req.method === 'HEAD') {
          const db = getOrLoadDatabase();
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(req.method === 'HEAD' ? '' : JSON.stringify(db));
        } else {
          res.statusCode = 404;
          res.end();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const plugins: any[] = [react(), tailwindcss(), codeSyncPlugin()];
  try {
    // @ts-ignore
    const m = await import('./.vite-source-tags.js');
    if (m && typeof m.sourceTags === 'function') {
      plugins.push(m.sourceTags());
    }
  } catch {
    // Ignore source tags if missing or failed
  }
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    plugins,
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      allowedHosts: true,
      watch: {
        ignored: ['**/src/data/liveData.json', '**/public/liveData.json', '**/data/ihas_live_database.json', '**/data/**', '**/liveData.json']
      }
    },
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
  };
})
