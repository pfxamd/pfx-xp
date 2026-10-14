import { VirtualDisk } from './disk.js';

const DATABASE = 'pfx-xp-disk';
const STORE = 'snapshots';
const CURRENT = 'local-machine';
let connection;

function request(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Storage request failed'));
  });
}

async function connect() {
  if (!globalThis.indexedDB) throw new Error('This browser does not provide persistent storage');
  const open = globalThis.indexedDB.open(DATABASE, 1);
  open.onupgradeneeded = () => {
    if (!open.result.objectStoreNames.contains(STORE)) open.result.createObjectStore(STORE);
  };
  const db = await request(open);
  db.onversionchange = () => { db.close(); connection = undefined; };
  return db;
}

async function database() {
  if (!connection) connection = connect().catch(error => { connection = undefined; throw error; });
  return connection;
}

function transact(db, mode, operation) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    let value;
    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error || new Error('Storage transaction failed'));
    tx.onabort = () => reject(tx.error || new Error('Storage transaction aborted'));
    const item = operation(tx.objectStore(STORE));
    item.onsuccess = () => { value = item.result; };
  });
}

const adapter = {
  async load() { return transact(await database(), 'readonly', store => store.get(CURRENT)); },
  async save(snapshot) { return transact(await database(), 'readwrite', store => store.put(snapshot, CURRENT)); },
};
let current;
export function getDisk() {
  if (!current) current = new VirtualDisk(adapter).initialize().catch(error => { current = undefined; throw error; });
  return current;
}
