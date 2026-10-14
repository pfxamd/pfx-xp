import { defineConfig, transformWithEsbuild } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

// The 2019 source uses JSX in .js files. Transform only our own source.
const classicJsx = {
  name: 'pfx-classic-jsx',
  enforce: 'pre',
  async transform(code, id) {
    if (id.startsWith(path.join(root, 'src') + path.sep) && /\.js$/.test(id)) {
      return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'transform' });
    }
  },
};

export default defineConfig({
  plugins: [classicJsx],
  resolve: {
    alias: {
      assets: path.resolve(root, 'src/assets'),
      components: path.resolve(root, 'src/components'),
      hooks: path.resolve(root, 'src/hooks'),
      WinXP: path.resolve(root, 'src/WinXP'),
    },
  },
  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },
  server: { port: 3000, strictPort: true },
});
