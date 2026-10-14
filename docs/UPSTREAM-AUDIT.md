# PFx XP migration audit

Original: [aduncandev/web-xp](https://github.com/aduncandev/web-xp) at `bc9528db08c3714e6dfd52be43e1dcb3fe4a216a`.

## Implemented

- Source pinned through a Git submodule; untouched by the overlay process.
- Adopted first-party filesystem utility, indexed node store and window shell bus modules, loaded into the disposable workspace.
- Local workspace builder with SHA verification and fail-closed source anchors.
- PFx Tools app integrated with the original program registry, virtual executable file, icon registry and Start menu.
- Unit and Playwright integration tests included, including first-party modules. They have not yet been run against a full local checkout in this session.
- No GitHub Actions used.

## Work remaining

1. Run the application and all tests locally; visually inspect desktop and PFx Tools.
2. Separate shell and core apps from unrelated optional games and personal content without breaking imports.
3. License-audit and replace media before any public redistribution.
4. Improve the privacy/security model; current upstream password strings in `localStorage` are not secure account authentication.
5. Review iframe sandbox rules; avoid a sandbox combining `allow-scripts` and `allow-same-origin` for same-origin untrusted pages.
6. Continue migrating the window reducer, filesystem persistence and UI into independently maintained PFx XP source, then remove runtime dependency on the upstream submodule.

The current overlay is a development integration rather than an independently deployable application.
