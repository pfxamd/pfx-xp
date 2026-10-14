# PFx XP

This branch is a **migration candidate**, not the production branch. It is built from the original [ShizukuIchi/winXP](https://github.com/ShizukuIchi/winXP), pinned at `856bb554b3667f62078010b4cee10cc2645761e1`, rather than the large webXP fork.

The original source is a Git submodule; PFx-owned filesystem and window modules remain in `src/core/`. The workspace assembler keeps the original checkout immutable, adapts the entrypoint for React 18, and uses Vite 6 rather than the original CRA tooling. The shell and six original apps are still upstream code. The custom core is not yet wired into the original shell.

## Local preview on Linux

```bash
git clone --recurse-submodules --branch migration/original-winxp https://github.com/pfxamd/pfx-xp.git
cd pfx-xp
npm install
npm run dev
```

Visit `http://localhost:3000`. Run `npm run build:local` and `npm run test:unit` locally. No GitHub Actions workflows are configured.

**Verification status:** Source structure and migration rules reviewed; full runtime build and browser checks not yet verified. Keep `main` unchanged until a successful visual and functional comparison.

## Preserve and adopt

The previous state is backed up at [backup/webxp-before-rebase](https://github.com/pfxamd/pfx-xp/tree/backup/webxp-before-rebase). Core modules and unit tests were retained in this migration branch. Integration requires adapting the original window reducer and adding a proper persistent filesystem; these are not yet integrated. Respect [MIT attribution](LICENSE), and review trademarked images and audio before redistribution.
