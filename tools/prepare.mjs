// Assemble a disposable development workspace from the pinned upstream source.
import { cp, mkdir, readFile, rename, rm, writeFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { constants } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PATCHES, patchSource } from './overlay.mjs';
import { CORE_MODULES } from './core-modules.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const UPSTREAM = join(ROOT, 'upstream', 'web-xp');
const WORKSPACE = join(ROOT, '.pfx-workspace');
const REVISION = 'bc9528db08c3714e6dfd52be43e1dcb3fe4a216a';

async function readable(path) {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function pinnedRevision() {
  const result = spawnSync('git', ['-C', UPSTREAM, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error('Missing Git submodule. Run: git submodule update --init --recursive');
  }
  if (result.stdout.trim() !== REVISION) {
    throw new Error('Unexpected upstream revision. Restore the pinned Git submodule before preparing PFx XP.');
  }
}

async function buildFingerprint() {
  const hash = createHash('sha256');
  hash.update(REVISION);
  const paths = [
    'tools/overlay.mjs',
    'tools/prepare.mjs',
    'overrides/apps/PFxTools/index.jsx',
    'overrides/apps/PFxTools/pfx-tools.svg',
    'tests/pfx-tools.spec.js',
    'tests/pfx-core.spec.js',
    'tests/pfx-window.spec.js',
    'tools/core-modules.mjs',
    ...CORE_MODULES.map(([source]) => source),
  ];
  for (const path of paths) hash.update(await readFile(join(ROOT, path)));
  return hash.digest('hex');
}

async function prepare() {
  if (!(await readable(join(UPSTREAM, 'package.json')))) {
    throw new Error('Upstream checkout is missing. Run: git submodule update --init --recursive');
  }
  pinnedRevision();
  const signature = await buildFingerprint();
  const previousKey = join(WORKSPACE, '.pfx-source-signature');
  if (await readable(previousKey)) {
    const same = (await readFile(previousKey, 'utf8')).trim() === signature;
    const modulesAvailable = await readable(join(UPSTREAM, 'node_modules'));
    const workspaceModules = await readable(join(WORKSPACE, 'node_modules'));
    if (same && (!modulesAvailable || workspaceModules)) {
      process.stdout.write('PFx XP workspace is already current.\n');
      return;
    }
  }
  const temp = join(ROOT, '.pfx-workspace.tmp-' + process.pid);
  await rm(temp, { recursive: true, force: true });
  await mkdir(temp, { recursive: true });
  try {
    const excluded = new Set(['.git', 'node_modules', 'dist', 'coverage', 'test-results', 'playwright-report']);
    await cp(UPSTREAM, temp, {
      recursive: true,
      force: false,
      errorOnExist: true,
      filter: path => {
        const rel = relative(UPSTREAM, path);
        return !rel.split(sep).some(part => excluded.has(part));
      },
    });
    for (const path of Object.keys(PATCHES)) {
      const destination = join(temp, path);
      const original = await readFile(destination, 'utf8');
      await writeFile(destination, patchSource(path, original), 'utf8');
    }
    // PFx-owned modules replace matching upstream paths in the generated copy.
    for (const [source, target] of CORE_MODULES) {
      await cp(join(ROOT, source), join(temp, target), { force: true });
    }
    await cp(join(ROOT, 'overrides', 'apps', 'PFxTools'),
      join(temp, 'src', 'WinXP', 'apps', 'PFxTools'), { recursive: true });
    await cp(join(ROOT, 'tests', 'pfx-tools.spec.js'),
      join(temp, 'tests', 'pfx-tools.spec.js'));
    await cp(join(ROOT, 'tests', 'pfx-core.spec.js'),
      join(temp, 'tests', 'pfx-core.spec.js'));
    await cp(join(ROOT, 'tests', 'pfx-window.spec.js'),
      join(temp, 'tests', 'pfx-window.spec.js'));

    const pkgPath = join(temp, 'package.json');
    const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
    pkg.name = 'pfx-xp-preview';
    pkg.private = true;
    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

    // A workspace always uses the same installed dependencies as the pinned source.
    const modules = join(UPSTREAM, 'node_modules');
    if (await readable(modules)) {
      const { symlink } = await import('node:fs/promises');
      await symlink(modules, join(temp, 'node_modules'), 'dir');
    }
    await writeFile(join(temp, '.pfx-source-signature'), signature + '\n', 'utf8');
    await rm(WORKSPACE, { recursive: true, force: true });
    await rename(temp, WORKSPACE);
    process.stdout.write('PFx XP workspace ready. Upstream files were not modified.\n');
    if (!(await readable(join(WORKSPACE, 'node_modules')))) {
      process.stdout.write('Dependencies missing; run npm run setup before npm run dev.\n');
    }
  } catch (error) {
    await rm(temp, { recursive: true, force: true });
    throw error;
  }
}

prepare().catch(error => {
  process.stderr.write('PFx XP: ' + error.message + '\n');
  process.exitCode = 1;
});
