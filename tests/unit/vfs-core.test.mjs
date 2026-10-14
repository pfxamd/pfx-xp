import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NodeStore } from '../../src/core/vfs/nodeStore.js';
import { getParentPath, normalizePath, joinPath, makeVfsNode, validateFileName } from '../../src/core/vfsUtils.js';

test('paths normalize Windows separators without breaking drive roots', () => {
  assert.equal(normalizePath('C:\\\\Projects\\\\demo\\\\'), 'C:/Projects/demo');
  assert.equal(normalizePath('C:\\\\'), 'C:/');
  assert.equal(getParentPath('C:/Projects/demo.txt'), 'C:/Projects');
  assert.equal(getParentPath('C:/Projects'), 'C:/');
  assert.equal(joinPath('C:/', 'Projects'), 'C:/Projects');
});

test('node records preserve the canonical model fields', () => {
  const item = makeVfsNode('C:/Projects/file.txt', 'file', { at: 0 });
  assert.equal(item.path, 'C:/Projects/file.txt');
  assert.equal(item.type, 'file');
  assert.equal(item.targetArgs, null);
  assert.equal(item.modifiedAt, 0);
  assert.equal(validateFileName('valid-file.txt'), null);
  assert.equal(validateFileName('invalid:name.txt'), 'invalid-chars');
});

test('NodeStore resolves case-insensitive paths and indexed children', () => {
  const store = new NodeStore();
  store.set({ path: 'C:/', type: 'drive' });
  store.set({ path: 'C:/Projects', type: 'folder' });
  store.set({ path: 'C:/Projects/Notes.txt', type: 'file' });
  assert.equal(store.size, 3);
  assert.equal(store.get('c:\\\\projects\\\\notes.txt')?.path, 'C:/Projects/Notes.txt');
  assert.deepEqual(store.childrenOf('c:/PROJECTS').map(x => x.path), ['C:/Projects/Notes.txt']);
  assert.deepEqual(store.descendantsOf('C:/').map(x => x.path), ['C:/Projects', 'C:/Projects/Notes.txt']);
  store.set({ path: 'c:/PROJECTS/NOTES.txt', type: 'file', content: 'updated' });
  assert.equal(store.size, 3);
  assert.equal(store.get('C:/Projects/notes.txt')?.content, 'updated');
  assert.deepEqual(store.childrenOf('C:/Projects').map(x => x.path), ['c:/PROJECTS/NOTES.txt']);
  assert.equal(store.delete('C:/projects/notes.TXT'), true);
  assert.equal(store.has('C:/Projects/notes.txt'), false);
  store.clear();
  assert.equal(store.size, 0);
});
