import { defineConfig, loadEnv, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import fs from 'node:fs';
import path from 'node:path';

// Plugin to automatically sync and write admin changes directly into the codebase without triggering file watcher reload
function codeSyncPlugin() {
  return {
    name: 'code-sync-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/sync-to-code', async (req: any, res: any) => {
        // Set CORS & JSON headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body);
              const dataFilePath = path.resolve(process.cwd(), 'src/data/liveData.json');
              const publicDataFilePath = path.resolve(process.cwd(), 'public/liveData.json');

              let existing: Record<string, any> = {};
              if (fs.existsSync(dataFilePath)) {
                try {
                  const raw = await fs.promises.readFile(dataFilePath, 'utf-8');
                  existing = JSON.parse(raw);
                } catch {
                  existing = {};
                }
              }

              const timestamp = new Date().toISOString();

              // Merge single key updates or full snapshots
              if (payload.snapshot && typeof payload.snapshot === 'object') {
                existing = { 
                  ...existing, 
                  ...payload.snapshot, 
                  _updatedAt: timestamp,
                  _meta: {
                    ...(existing._meta || {}),
                    authoritative: true,
                    lastSavedAt: timestamp,
                    syncedBy: 'Admin Control Panel Auto Engine'
                  }
                };
              } else if (payload.key) {
                existing[payload.key] = payload.data;
                existing._updatedAt = timestamp;
                if (!existing._meta) existing._meta = {};
                existing._meta.lastSavedAt = timestamp;
                existing._meta.lastUpdatedKey = payload.key;
              } else {
                existing = { ...existing, ...payload, _updatedAt: timestamp };
              }

              const jsonString = JSON.stringify(existing, null, 2);

              // Write to src/data/liveData.json
              await fs.promises.writeFile(dataFilePath, jsonString, 'utf-8');

              // Also write to public/liveData.json for direct runtime accessibility
              try {
                const publicDir = path.resolve(process.cwd(), 'public');
                if (!fs.existsSync(publicDir)) {
                  fs.mkdirSync(publicDir, { recursive: true });
                }
                await fs.promises.writeFile(publicDataFilePath, jsonString, 'utf-8');
              } catch (publicErr) {
                console.warn('[CodeSync Warning] Failed to sync public/liveData.json:', publicErr);
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ 
                success: true, 
                message: 'Admin changes written directly to codebase files (src/data/liveData.json & public/liveData.json)',
                updatedAt: timestamp
              }));
            } catch (err: any) {
              console.error('[CodeSync Error]:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else if (req.method === 'GET') {
          try {
            const dataFilePath = path.resolve(process.cwd(), 'src/data/liveData.json');
            if (fs.existsSync(dataFilePath)) {
              const content = await fs.promises.readFile(dataFilePath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(content);
              return;
            }
          } catch (_e) {
            void _e;
          }
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({}));
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
        ignored: ['**/src/data/liveData.json', '**/public/liveData.json', '**/liveData.json']
      }
    },
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
  };
})
