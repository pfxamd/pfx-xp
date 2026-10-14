# PFx XP upstream migration assessment

Pinned original: [webXP](https://github.com/aduncandev/web-xp), commit `bc9528db08c3714e6dfd52be43e1dcb3fe4a216a`.

## Repository linkage

The `upstream/web-xp` Git submodule references the exact original upstream commit. GitHub stores a pointer, not a 418 MB copy, in this repository. Clone with `--recurse-submodules` to inspect/run the reference app on a local machine. Treat the submodule as read-only reference code until modules are deliberately adopted into PFx XP. Do not edit a detached submodule checkout and expect the parent repo to track those source changes.

## Verified from upstream source

- **Architecture:** React 18, Vite 6, desktop in `src/WinXP/`.
- **Window manager:** `src/WinXP/reducer.js`, `Windows/`, `shellBus.js`.
- **Virtual filesystem:** `src/context/vfs/`, with IndexedDB persistence and memory fallback.
- **Application registry:** `src/WinXP/apps/index.jsx`.
- **Tests:** Playwright browser integration suite in `tests/`.

## Blockers to address before the customized release

1. **Licensing:** upstream's MIT grant covers code but not all assets, names, fonts, Nintendo/Microsoft media or personal content. Replace or clear permissions before distributing built assets.
2. **Account security:** upstream `src/context/users.js` stores plaintext passwords in `localStorage`, explicitly labelled simulation-grade. Do not claim secure local account separation.
3. **Embedded pages:** the Internet Explorer clone uses iframes with `allow-scripts` and `allow-same-origin`. Untrusted pages must be isolated and the navigation message source/origin validated.
4. **Storage reliability:** IndexedDB/localStorage are per-browser storage and cannot replace an authenticated durable filesystem. Add recovery tests and avoid accidental schema resets.
5. **Dependencies:** review third-party application assets/licenses and audit package versions.
6. **Baseline tests:** run the build and Playwright suite locally on Linux before refactoring. No browser test or build has been executed in this repository yet.

## Adoption order

1. Run the pinned upstream locally to establish a visual, functional and test baseline.
2. Identify a minimal legal asset set; remove guestbook, store and unrelated games from the intended product.
3. Port the window manager, shell, filesystem and core apps into independently maintainable PFx XP modules.
4. Introduce a stable external-app registration API, security boundaries and independent regression tests.
5. Verify build and visual behaviour locally, then publish PFx XP without GitHub Actions.

**Current result:** pinned upstream reference and documentation, not a completed application migration.
