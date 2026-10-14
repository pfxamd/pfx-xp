// Build a disposable local preview from the original winXP source.
import { access, cp, mkdir, readFile, rm, rename, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join, relative, sep } from 'node:path';
import { ROOT, UPSTREAM, verifySource, PIN } from './check-source.mjs';

const OUT = resolve(ROOT, '.pfx-runtime');
const INPUTS = ['app/package.json', 'app/index.html', 'app/vite.config.mjs', 'app/src/entry.jsx', 'app/src/font.css', 'scripts/prepare.mjs', 'scripts/check-source.mjs'];
async function exists(p) { try { await access(p); return true; } catch { return false; } }
async function signature() {
  const hash = createHash('sha256'); hash.update(PIN);
  for (const file of INPUTS) hash.update(await readFile(resolve(ROOT, file)));
  return hash.digest('hex');
}

async function prepare() {
  await verifySource();
  const fingerprint = await signature();
  if (await exists(join(OUT, '.pfx-signature'))) {
    if ((await readFile(join(OUT, '.pfx-signature'), 'utf8')).trim() === fingerprint) {
      process.stdout.write('PFx XP workspace up to date.\n');
      return;
    }
  }
  const tmp = resolve(ROOT, '.pfx-runtime.tmp-' + process.pid);
  await rm(tmp, { force: true, recursive: true });
  await mkdir(tmp, { recursive: true });
  try {
    const skip = new Set(['.git', 'node_modules', 'demo', 'yarn.lock', 'now.json', 'serviceWorker.js']);
    for (const directory of ['src', 'public']) {
      await cp(resolve(UPSTREAM, directory), join(tmp, directory), {
        recursive: true,
        filter: p => {
          const rest = relative(UPSTREAM, p);
          return !rest.split(sep).some(segment => skip.has(segment));
        },
      });
    }
    await cp(resolve(ROOT, 'app/package.json'), join(tmp, 'package.json'));
    await cp(resolve(ROOT, 'app/index.html'), join(tmp, 'index.html'));
    await cp(resolve(ROOT, 'app/vite.config.mjs'), join(tmp, 'vite.config.mjs'));
    await cp(resolve(ROOT, 'app/src/entry.jsx'), join(tmp, 'src/entry.jsx'));
    await cp(resolve(ROOT, 'app/src/font.css'), join(tmp, 'src/assets/font.css'));
    await writeFile(join(tmp, '.pfx-signature'), fingerprint + '\n');
    // The preview is disposable; after modifying the input config, run npm run setup again.
    await rm(OUT, { recursive: true, force: true });
    await rename(tmp, OUT);
    process.stdout.write('Original winXP assembled with PFx modern entry in .pfx-runtime.\n');
    process.stdout.write('Run npm run setup to install dependencies locally.\n');
  } catch(e) {
    await rm(tmp, { recursive: true, force: true });
    throw e;
  }
}
prepare().catch(e => { process.stderr.write('PFx XP: '+e.message+'\n'); process.exitCode = 1; });
