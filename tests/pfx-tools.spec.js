import { test, expect } from './fixtures';

test('PFx Tools is registered and backed by a seeded system file', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const [apps, constants, defaults, icons] = await Promise.all([
      import('/src/WinXP/apps/index.jsx'),
      import('/src/context/vfsConstants.js'),
      import('/src/context/vfsDefaults.js'),
      import('/src/context/vfsIcons.js'),
    ]);
    const path = constants.EXE_PATHS.PFX_TOOLS;
    const nodes = defaults.buildDefaultFileSystem(['Guest']);
    const program = apps.getProgramByPath(path);
    return {
      program: program?.displayName,
      executable: nodes.some(node => node.path === path && node.type === 'file'),
      menuShortcut: nodes.some(node => node.type === 'shortcut' &&
        node.target === path && node.path.includes('/Start Menu/Programs/')),
      command: apps.getProgramByCommand('pfx-tools')?.exePath,
      icon: Boolean(icons.ICON_REGISTRY['pfx-tools']),
    };
  });
  expect(result).toEqual({
    program: 'PFx Tools',
    executable: true,
    menuShortcut: true,
    command: 'C:/Program Files/PFx/Tools/pfx-tools.exe',
    icon: true,
  });
});
