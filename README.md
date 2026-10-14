# PFx XP

Browser-based Windows XP-style desktop, developed from the open-source [webXP](https://github.com/aduncandev/web-xp) project.

## Development milestone 1

The pinned upstream shell, window manager, filesystem and built-in applications are preserved in the Git submodule at `upstream/web-xp` (commit `bc9528db08c3714e6dfd52be43e1dcb3fe4a216a`). PFx XP now has a separate **disposable development workspace** with an overlay that registers its first independent application, **PFx Tools**, in the original shell and Start menu. The original submodule stays untouched.

This is a working *source integration*, **not yet a standalone fork**. Its build and browser tests still need to run on a machine with Node and network access. Third-party asset rights must be cleared before redistribution.

## Run locally (Node 22+)

```bash
git clone --recurse-submodules https://github.com/pfxamd/pfx-xp.git
cd pfx-xp
npm run setup
npm run dev
```

Open `http://localhost:3000`. Once signed in, open **PFx Tools** from Start > All Programs, or use Run with `pfx-tools`. Existing local profiles may require the Run command to see the newly added shortcut.

## Checks (local only)

```bash
npm run test:unit
cd upstream/web-xp && npx playwright install chromium && cd ../..
npm run test:smoke
npm run test:xp
npm run build:local
```

No GitHub Actions workflows are configured. Build output is for **local verification only**; do not redistribute bundled media before a rights review.

## Architecture

- `upstream/web-xp/`: pinned reference source as a submodule (not modified)
- `tools/prepare.mjs`: assemble an ignored workspace from the pinned source
- `tools/overlay.mjs`: strict, fail-closed integration patches against known source anchors
- `overrides/apps/PFxTools/`: first independent program, launched by the real window manager
- `tests/`: integration and overlay tests
- `.pfx-workspace/`: generated and ignored; do not edit files here

## Security and attribution

The original code is MIT-licensed; [LICENSE](LICENSE) preserves the upstream copyright. The upstream assets (including Microsoft/Nintendo media, sounds and other third-party materials) are not automatically MIT-licensed. The original local account passwords are simulation-grade, not a security boundary. See [migration audit](docs/UPSTREAM-AUDIT.md).
