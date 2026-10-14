import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  root: ROOT,
  plugins: [
    { name: 'original-js-jsx', enforce: 'pre', async transform(code, id) {
      if (!id.startsWith(path.join(ROOT, 'src') + path.sep) || !id.endsWith('.js')) return null;
      return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
    } },
    react(),
  ],
  resolve: { alias: {
    assets: path.join(ROOT, 'src/assets'),
    components: path.join(ROOT, 'src/components'),
    hooks: path.join(ROOT, 'src/hooks'),
    WinXP: path.join(ROOT, 'src/WinXP'),
  } },
  server: { port: 3000, open: false },
  build: { outDir: path.join(ROOT, 'dist'), emptyOutDir: true },
});
