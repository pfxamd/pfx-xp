// Validate all source and overlay imports before installing any packages.
import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join, normalize, relative, resolve } from 'node:path';
import { verifySource, ROOT, UPSTREAM } from './check-source.mjs';
import { REPLACEMENTS, patchOriginalFile } from './patch-apps.mjs';

const ownedRoot = join(ROOT, 'src');
const roots = [UPSTREAM, ROOT];

async function present(path) {
  try { await access(path); return true; } catch { return false; }
}

async function contents(root, prefix = 'src') {
  const out = [];
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
    const part = prefix + '/' + entry.name;
    if (entry.isDirectory()) out.push(...await contents(root, part));
    else if (entry.isFile()) out.push(part);
  }
  return out;
}

const suffixes = ['', '.js', '.jsx', '.css', '.json', '/index.js', '/index.jsx'];
async function checkDependency(importer, request, upstreamPaths, ownedPaths) {
  let target;
  if (request.startsWith('.')) {
    target = normalize(join(dirname(importer), request)).replaceAll('\\', '/');
  } else {
    const alias = request.split('/')[0];
    if (!['assets', 'components', 'hooks', 'WinXP'].includes(alias)) return true;
    target = 'src/' + request;
  }
  if (target.startsWith('../') || !target.startsWith('src/')) return false;
  return suffixes.some(suffix => upstreamPaths.has(target + suffix) || ownedPaths.has(target + suffix));
}

export async function checkIntegration() {
  await verifySource();
  const sourcePaths = new Set(await contents(UPSTREAM));
  const ownedPaths = new Set(await contents(ROOT));
  const failures = [];
  let imports = 0;
  let patchFiles = 0;
  for (const path of sourcePaths) {
    if (!path.endsWith('.js') && !path.endsWith('.jsx')) continue;
    let code = await readFile(join(UPSTREAM, path), 'utf8');
    if (REPLACEMENTS[path]) {
      code = patchOriginalFile(path, code);
      patchFiles += 1;
    }
    if (path === 'src/WinXP/index.js') {
      const first = code.indexOf('const initState = {');
      const last = code.indexOf('function WinXP() {', first);
      const own = await readFile(join(ownedRoot, 'core/window/classicReducer.js'), 'utf8');
      if (first < 0 || last < 0 || !own.includes(code.slice(first, last))) failures.push('Classic window reducer mismatch');
      else code = "import { createClassicWindowState } from '../core/window/classicReducer.js';\n" + code.slice(0, first) + code.slice(last);
    }
    const regex = /\bimport\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
    for (const match of code.matchAll(regex)) {
      imports += 1;
      if (!await checkDependency(path, match[1], sourcePaths, ownedPaths)) {
        failures.push(path + ': unresolved ' + match[1]);
      }
    }
  }
  // Application modules not in the original tree must exist in PFx XP.
  for (const path of ['src/core/vfs/disk.js', 'src/core/vfs/browserDisk.js',
    'src/core/window/classicReducer.js', 'src/core/vfs/nodeStore.js']) {
    if (!ownedPaths.has(path)) failures.push('Missing first-party module: ' + path);
  }
  if (patchFiles !== Object.keys(REPLACEMENTS).length) failures.push('Patch file count mismatch');
  if (failures.length) throw new Error(failures.join('\n'));
  return { files: sourcePaths.size, patchedFiles: patchFiles, importChecks: imports };
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  checkIntegration().then(report => console.log('XP migration source validation:', JSON.stringify(report)))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
