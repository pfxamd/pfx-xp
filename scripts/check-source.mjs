// Fail closed when the pinned upstream revision or the source layout changes.
import { spawnSync } from 'node:child_process';
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PIN = '856bb554b3667f62078010b4cee10cc2645761e1';
export const ROOT = resolve(import.meta.dirname, '..');
export const UPSTREAM = resolve(ROOT, 'upstream/winxp-original');

export function assertPinnedSource() {
  const proc = spawnSync('git', ['-C', UPSTREAM, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
  if (proc.status !== 0) throw new Error('Missing original winXP submodule. Run: git submodule update --init --recursive');
  const actual = proc.stdout.trim();
  if (actual !== PIN) throw new Error('Unexpected winXP revision: ' + actual);
}
export async function verifySource() {
  assertPinnedSource();
  for (const file of [
    'src/WinXP/index.js', 'src/WinXP/apps/index.js', 'src/index.js',
    'src/assets/windowsIcons/ie.png', 'public/index.html', 'package.json',
  ]) await access(resolve(UPSTREAM, file));
  return true;
}
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  verifySource().then(() => process.stdout.write('Pinned original winXP source verified.\n')).catch(e => {
    process.stderr.write(e.message + '\n'); process.exitCode = 1;
  });
}
