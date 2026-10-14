import test from 'node:test';
import assert from 'node:assert/strict';
import { patchOriginalFile, REPLACEMENTS } from '../../scripts/patch-apps.mjs';

test('source overlays require exactly one match for every anchor', () => {
  for (const [path, rules] of Object.entries(REPLACEMENTS)) {
    const fixture = rules.map(({ from }) => from).join('\n~~~\n');
    const patched = patchOriginalFile(path, fixture);
    for (const { to } of rules) assert.ok(patched.includes(to), path);
  }
});
test('changed source is rejected instead of silently losing integration', () => {
  assert.throws(() => patchOriginalFile('src/WinXP/apps/Notepad/index.js', 'empty'), /expected exactly one/);
});
