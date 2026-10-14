# Original-source migration

The original ShizukuIchi/winXP is the new candidate foundation. This is a separate branch and `main` is unchanged.

## Strategy
- Keep `backup/pre-original-migration` and the entire historical Git graph.
- Drop the bloated prior webXP dependency **only on the migration branch**.
- Pin the 2019–2023 original as a read-only submodule, including its original media without duplicating it in our Git history.
- Assemble a disposable local workspace with Vite 6, React 18, and styled-components 5.
- Retain our previously built filesystem and window logic, without prematurely replacing the original's structurally different window reducer.
- Validate a real local build and visual behavior before moving `main`.

## Known gaps
- The original does **not** provide a persistent virtual filesystem or account system.
- Its Paint uses an external iframe; other tools may require network access.
- React 18, Vite and current dependencies are migration **candidates**, not yet runtime-verified.
- Review Microsoft and third-party assets/licensing before distributing a public build.
- The original uses JSX in .js sources and requires targeted transformation in the Vite configuration.

No GitHub Actions are configured or required by this branch. No claim of a successful browser smoke test until it is actually run.

## Implemented integration

- Original window reducer extracted into first-party `src/core/window/classicReducer.js` and loaded into the classic shell.
- IndexedDB-backed virtual disk (`src/core/vfs/disk.js`, `browserDisk.js`), with explicit persistence and rollback tests.
- Original Notepad: New, Open, Save, Save As and Ctrl+S against the real virtual disk.
- Original My Computer: live My Documents file listing; click a document to open it in a new Notepad window.
- Window renderer now mounts program components with JSX rather than calling them as functions, isolating their React hooks.
- Added local browser smoke coverage for Chromium and Firefox, without GitHub Actions.

### Acceptance status

Pure-unit behavior has been checked; full production build, persistent browser smoke tests and visual parity have not been verified. Keep the production `main` branch unchanged until those checks succeed.

## Offline-first local validation

Run `npm run verify:local` on Node 22+. This executes all first-party unit tests and source import checks, assembles the pinned original, builds it, installs the Playwright browser engines if missing, and tests Chromium/Firefox. No CI or GitHub Actions minutes. The migration must not be merged into `main` unless the build and both browser tests pass.
