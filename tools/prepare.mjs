import { cp, mkdir, readFile, rename, rm, writeFile, access, lstat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'upstream/original-winxp');
const output = path.join(root, '.pfx-workspace');
const revision = '856bb554b3667f62078010b4cee10cc2645761e1';
const localPaths = ['package.json','tools/prepare.mjs','tools/source-index.js','tools/source-html.html','tools/source-vite.mjs'];
const run = (command, args) => {
  const p = spawnSync(command, args, { encoding:'utf8' });
  if (p.status !== 0) throw Error(p.stderr || p.stdout || command+' failed');
  return p.stdout.trim();
};
const exists = async file => { try { await access(file); return true; } catch { return false; } };

async function main() {
  if (!(await exists(path.join(source,'package.json')))) throw Error('Initialize source: git submodule update --init --recursive');
  if (run('git',['-C',source,'rev-parse','HEAD']) !== revision) throw Error('Source revision differs from pinned version');
  const hash = createHash('sha256');
  hash.update(revision);
  for (const file of localPaths) hash.update(await readFile(path.join(root,file)));
  const signature = hash.digest('hex');
  if ((await exists(path.join(output,'.pfx-signature'))) &&
      (await readFile(path.join(output,'.pfx-signature'),'utf8')).trim() === signature) {
    console.log('Workspace current'); return;
  }
  const temp = path.join(root,'.pfx-workspace.tmp-'+process.pid);
  await rm(temp,{recursive:true,force:true});
  await mkdir(temp,{recursive:true});
  try {
    await cp(source,temp,{recursive:true,filter:p=>!path.relative(source,p).split(path.sep).some(t=>['.git','node_modules','build'].includes(t))});
    await writeFile(path.join(temp,'index.html'),await readFile(path.join(root,'tools/source-html.html')));
    await writeFile(path.join(temp,'src/index.js'),await readFile(path.join(root,'tools/source-index.js')));
    await writeFile(path.join(temp,'vite.config.mjs'),await readFile(path.join(root,'tools/source-vite.mjs')));
    await writeFile(path.join(temp,'.pfx-signature'),signature+'\n');
    await rm(output,{recursive:true,force:true});
    await rename(temp,output);
    console.log('Original winXP source prepared for modern Vite/React toolchain');
  } catch(e) { await rm(temp,{recursive:true,force:true}); throw e; }
}
main().catch(e=>{console.error(e.message);process.exitCode=1});
