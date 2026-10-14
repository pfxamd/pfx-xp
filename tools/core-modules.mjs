// First-party core modules, copied into the disposable XP workspace.
// Keep source/target pairs explicit to avoid copying unreviewed files.
export const CORE_MODULES = Object.freeze([
  ['src/core/vfsUtils.js', 'src/context/vfsUtils.js'],
  ['src/core/vfs/nodeStore.js', 'src/context/vfs/nodeStore.js'],
  ['src/core/window/shellBus.js', 'src/WinXP/shellBus.js'],
]);
