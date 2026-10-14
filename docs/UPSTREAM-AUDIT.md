# Upstream migration assessment

Source inspected: [webXP](https://github.com/aduncandev/web-xp), commit `bc9528db08c3714e6dfd52be43e1dcb3fe4a216a`.

## What has been checked

- **Architecture:** React 18 and Vite 6, with the desktop in `src/WinXP/`.
- **Window lifecycle:** `src/WinXP/reducer.js`, `Windows/`, and `shellBus.js`.
- **Storage:** `src/context/vfs/` with IndexedDB persistence and a browser-memory fallback.
- **Apps:** registry in `src/WinXP/apps/index.jsx` with executable-path mapping.
- **Tests:** browser integration tests under `tests/` with Playwright.

## Blockers before production use

1. **Rights and assets:** upstream MIT covers code, not automatically Microsoft/Nintendo artwork, sounds, games or personal media. Audit assets before public redistribution.
2. **Accounts:** upstream `src/context/users.js` stores passwords in plaintext in browser localStorage. Its login UI is simulation-grade, not a secure authentication boundary.
3. **Embedded browser:** upstream Internet Explorer uses iframe URLs with `allow-scripts` and `allow-same-origin`; enforce origin isolation and validated navigation before handling untrusted pages.
4. **Persistence:** IndexedDB and localStorage provide per-browser persistence, not authenticated, cross-device or tamper-resistant storage. Ensure recoverability before changing schema.
5. **Reproducibility:** confirm the pinned revision builds and baseline Playwright tests pass on a local Linux machine before refactoring.
6. **Dependencies:** audit licenses and vulnerabilities of packages and optional third-party applications.

## Planned adoption sequence

1. Stage the exact upstream version locally with `tools/fetch-upstream.sh` and review the source.
2. Identify a legally redistributable, minimized set of assets and remove optional games, store, guestbook and personal material.
3. Bring across a working, tested shell and virtual filesystem, keeping attribution intact.
4. Isolate apps behind a stable registration API and replace simulated security where real protection is needed.
5. Run all tests locally, with no GitHub Actions workflows.

**Status:** source review completed; source code not yet imported. This document is not a claim of a successful build or runtime test.
