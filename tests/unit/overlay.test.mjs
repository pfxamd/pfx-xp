import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PATCHES, applyRules, patchSource } from '../../tools/overlay.mjs';

test('all overlay rules have unique anchors and patch correctly', () => {
  for (const [path, rules] of Object.entries(PATCHES)) {
    const input = rules.map(rule => rule.find).join('\n\n');
    const result = patchSource(path, input);
    for (const rule of rules) {
      assert.ok(result.includes(rule.replace), path);
    }
  }
});

test('generated virtual folders use Program Files interpolation', () => {
  const rules = PATCHES['src/context/vfsDefaults.js'];
  const changes = patchSource('src/context/vfsDefaults.js', rules.map(rule => rule.find).join('\n\n'));
  assert.ok(changes.includes('`${PROGRAM_FILES}/PFx`'));
  assert.ok(changes.includes('`${PROGRAM_FILES}/PFx/Tools`'));
});

test('overlay rejects missing or repeated anchors', () => {
  assert.throws(() => applyRules('none', [{ find: 'one', replace: 'two' }]), /found 0/);
  assert.throws(() => applyRules('one one', [{ find: 'one', replace: 'two' }]), /found 2/);
});
