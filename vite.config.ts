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
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body);
              const dataFilePath = path.resolve(process.cwd(), 'src/data/liveData.json');

              let existing: Record<string, any> = {};
              if (fs.existsSync(dataFilePath)) {
                try {
                  const raw = await fs.promises.readFile(dataFilePath, 'utf-8');
                  existing = JSON.parse(raw);
                } catch {
                  existing = {};
                }
              }

              // Merge single key updates or full snapshots
              if (payload.snapshot && typeof payload.snapshot === 'object') {
                existing = { ...existing, ...payload.snapshot, _updatedAt: new Date().toISOString() };
              } else if (payload.key) {
                existing[payload.key] = payload.data;
                existing._updatedAt = new Date().toISOString();
              } else {
                existing = { ...existing, ...payload, _updatedAt: new Date().toISOString() };
              }

              await fs.promises.writeFile(dataFilePath, JSON.stringify(existing, null, 2), 'utf-8');

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: 'Database updated successfully' }));
            } catch (err: any) {
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
        ignored: ['**/src/data/liveData.json', '**/liveData.json']
      }
    },
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
  };
})
