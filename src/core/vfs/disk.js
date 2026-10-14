import { NodeStore } from './nodeStore.js';
import { getParentPath, getBaseName, normalizePath, makeVfsNode, validateFileName } from '../vfsUtils.js';

const ROOT = 'C:/';
export const DOCUMENTS = 'C:/My Documents';
const SCHEMA = 1;
const MAX_TEXT = 2 * 1024 * 1024;

function canonical(path) {
  if (typeof path !== 'string') throw new TypeError('Invalid file path');
  const normalized = normalizePath(path.trim());
  if (!/^C:\/(?:[^/]+(?:\/[^/]+)*)?$/.test(normalized) ||
      normalized.split('/').some(segment => segment === '.' || segment === '..')) {
    throw new Error('File path must stay inside the local C: drive');
  }
  return normalized;
}

export class VirtualDisk {
  constructor(storage) {
    if (!storage || typeof storage.load !== 'function' || typeof storage.save !== 'function') {
      throw new TypeError('A storage adapter is required');
    }
    this.storage = storage;
    this.store = new NodeStore();
    this.listeners = new Set();
    this.writes = Promise.resolve();
    this.ready = false;
  }

  async initialize() {
    if (this.ready) return this;
    const snapshot = await this.storage.load();
    if (snapshot != null) {
      if (snapshot.schema !== SCHEMA || !Array.isArray(snapshot.nodes)) {
        throw new Error('Unsupported virtual disk format. The existing data was not changed.');
      }
      if (snapshot.nodes.length > 10000) throw new Error('Virtual disk index is too large');
      for (const node of snapshot.nodes) {
        if (!node || typeof node.path !== 'string' || !['drive', 'folder', 'file'].includes(node.type)) {
          throw new Error('Invalid virtual disk metadata');
        }
        const path = canonical(node.path);
        if (path !== node.path || (node.type === 'file' && typeof node.content !== 'string')) {
          throw new Error('Invalid virtual disk content');
        }
        this.store.set({ ...node });
      }
      if (!this.store.has(ROOT) || !this.store.has(DOCUMENTS)) throw new Error('Virtual disk roots are missing');
    } else {
      const now = Date.now();
      this.store.set(makeVfsNode(ROOT, 'drive', { name: 'Local Disk (C:)', at: now }));
      this.store.set(makeVfsNode(DOCUMENTS, 'folder', { at: now }));
      await this.storage.save(this.snapshot());
    }
    this.ready = true;
    return this;
  }

  assertReady() {
    if (!this.ready) throw new Error('Virtual disk is not ready');
  }

  snapshot() {
    return { schema: SCHEMA, nodes: [...this.store.values()].map(node => ({ ...node })) };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) listener();
  }

  listFiles(folder = DOCUMENTS) {
    this.assertReady();
    const path = canonical(folder);
    const dir = this.store.get(path);
    if (!dir || !['folder', 'drive'].includes(dir.type)) throw new Error('Folder not found');
    return this.store.childrenOf(path).filter(node => node.type === 'file')
      .map(node => ({ path: node.path, name: node.name, size: node.size, modifiedAt: node.modifiedAt }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  readFile(path) {
    this.assertReady();
    const node = this.store.get(canonical(path));
    return node && node.type === 'file' ? node.content : null;
  }

  async writeFile(path, content) {
    this.assertReady();
    const p = canonical(path);
    const name = getBaseName(p);
    if (validateFileName(name) !== null || p === ROOT) throw new Error('Invalid file name');
    if (typeof content !== 'string' || content.length > MAX_TEXT) throw new Error('Text file is too large');
    const parent = this.store.get(getParentPath(p));
    if (!parent || !['folder', 'drive'].includes(parent.type)) throw new Error('Parent folder not found');
    const operation = async () => {
      const previous = this.store.get(p);
      if (previous && previous.type !== 'file') throw new Error('Cannot overwrite a folder');
      const now = Date.now();
      const next = { ...(previous || makeVfsNode(p, 'file', { name, at: now })),
        path: previous?.path || p, content, size: new TextEncoder().encode(content).byteLength, modifiedAt: now };
      this.store.set(next);
      try { await this.storage.save(this.snapshot()); }
      catch (error) { this.store.delete(next.path); if (previous) this.store.set(previous); throw error; }
      this.notify();
      return next.path;
    };
    const result = this.writes.then(operation);
    this.writes = result.catch(() => {});
    return result;
  }

  async deleteFile(path) {
    this.assertReady();
    const p = canonical(path);
    const operation = async () => {
      const previous = this.store.get(p);
      if (!previous || previous.type !== 'file') throw new Error('File not found');
      this.store.delete(p);
      try { await this.storage.save(this.snapshot()); }
      catch (error) { this.store.set(previous); throw error; }
      this.notify();
    };
    const result = this.writes.then(operation);
    this.writes = result.catch(() => {});
    return result;
  }
}
