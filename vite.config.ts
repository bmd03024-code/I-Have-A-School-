import { defineConfig, loadEnv, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const plugins: any[] = [react(), tailwindcss()];
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
    },
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
  };
})
