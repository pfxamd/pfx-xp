import test from 'node:test';
import assert from 'node:assert/strict';
import { VirtualDisk, DOCUMENTS } from '../../src/core/vfs/disk.js';

function storage(initial) {
  let snapshot = initial;
  let fails = false;
  return { load: async () => snapshot, save: async value => { if (fails) throw Error('Disk full'); snapshot = structuredClone(value); }, fail: on => { fails = on; }, state: () => snapshot };
}

test('a file survives a new disk session and keeps Windows case-insensitive paths', async () => {
  const adapter = storage();
  const disk = await new VirtualDisk(adapter).initialize();
  assert.equal(disk.listFiles().length, 0);
  await disk.writeFile(DOCUMENTS + '/Notes.txt', 'Hello XP');
  assert.equal(disk.readFile('c:/my documents/NOTES.TXT'), 'Hello XP');
  const reopened = await new VirtualDisk(adapter).initialize();
  assert.deepEqual(reopened.listFiles().map(x => x.name), ['Notes.txt']);
  assert.equal(reopened.readFile(DOCUMENTS + '/Notes.txt'), 'Hello XP');
});

test('file mutations are transactional and do not swallow storage failures', async () => {
  const adapter = storage();
  const disk = await new VirtualDisk(adapter).initialize();
  await disk.writeFile(DOCUMENTS + '/Saved.txt', 'original');
  adapter.fail(true);
  await assert.rejects(disk.writeFile(DOCUMENTS + '/Saved.txt', 'new'), /Disk full/);
  assert.equal(disk.readFile(DOCUMENTS + '/Saved.txt'), 'original');
  await assert.rejects(disk.deleteFile(DOCUMENTS + '/Saved.txt'), /Disk full/);
  assert.equal(disk.readFile(DOCUMENTS + '/Saved.txt'), 'original');
  adapter.fail(false);
  await disk.deleteFile(DOCUMENTS + '/Saved.txt');
  assert.equal(disk.readFile(DOCUMENTS + '/Saved.txt'), null);
});

test('virtual disk refuses traversal and preserves unknown-format data', async () => {
  const adapter = storage();
  const disk = await new VirtualDisk(adapter).initialize();
  await assert.rejects(disk.writeFile('C:/../outside.txt', 'x'), /inside/);
  await assert.rejects(disk.writeFile(DOCUMENTS + '/bad:name.txt', 'x'), /Invalid/);
  await assert.rejects(new VirtualDisk(storage({ schema: 2, nodes: [] })).initialize(), /Unsupported/);
});

test('queued writes finish in order', async () => {
  const disk = await new VirtualDisk(storage()).initialize();
  await Promise.all([disk.writeFile(DOCUMENTS + '/note.txt', 'one'), disk.writeFile(DOCUMENTS + '/note.txt', 'two')]);
  assert.equal(disk.readFile(DOCUMENTS + '/note.txt'), 'two');
});
