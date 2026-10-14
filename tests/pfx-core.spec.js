import { test, expect } from './fixtures';

test('PFx-owned filesystem core loads through the upstream Vite shell', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const [vfs, store, bus] = await Promise.all([
      import('/src/context/vfsUtils.js'),
      import('/src/context/vfs/nodeStore.js'),
      import('/src/WinXP/shellBus.js'),
    ]);
    const instance = new store.NodeStore();
    instance.set({ path: 'C:/Test', type: 'folder' });
    return {
      normalized: vfs.normalizePath('C:\\\\Test\\\\'),
      found: instance.has('c:/TEST'),
      hasWindows: typeof bus.getWindows === 'function',
    };
  });
  expect(result).toEqual({ normalized: 'C:/Test', found: true, hasWindows: true });
});
