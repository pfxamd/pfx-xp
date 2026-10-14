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
