# PFx XP

A modern, browser-based Windows XP recreation, being rebuilt on the original [ShizukuIchi/winXP](https://github.com/ShizukuIchi/winXP) instead of the larger webXP fork.

## Migration branch

This branch is an **isolated candidate**, not the production `main` branch. The current project is preserved at `backup/pre-original-migration`.

The original source is pinned as a Git submodule at `upstream/winxp-original`, revision `856bb554b3667f62078010b4cee10cc2645761e1`. A local script assembles an ignored development copy with a modern Vite/React 18 entry, keeping upstream source untouched. No GitHub Actions workflows are used.

### Linux / local development

Requires Node.js 22+, npm, and Git.

```bash
git clone --branch migration/original-winxp --recurse-submodules https://github.com/pfxamd/pfx-xp.git
cd pfx-xp
npm run test:unit
npm run setup
npm run dev
```

Open `http://localhost:3000`. The `setup` command installs packages **locally** only. To inspect a build, run `npm run build:local`. The preview is a developer build until verified in a browser.

### Architecture

- `upstream/winxp-original/`: exact original, read-only reference containing original source and assets
- `app/`: modernized entry/config; no upstream files are edited
- `scripts/prepare.mjs`: copies original source into the ignored `.pfx-runtime/` directory and applies modern entry/config
- `src/core/`: independently owned modules from the prior PFx XP work; preserved for deliberate integration into the new shell
- `tests/unit/`: regression tests for those owned core modules

The original desktop currently has six core applications; it has no durable virtual filesystem. The independently owned filesystem utilities are **not yet wired into the original desktop**. Preserve the original UX first and integrate the new core incrementally.

### Licensing

The original code is MIT licensed; attribution remains in `LICENSE` and the original submodule. Microsoft artwork and trademarks, and third-party assets, need independent rights review before redistribution. The local preview should not be described as a Windows OS emulator or a finished production release.
