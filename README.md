# PFx XP

A browser-based Windows XP-inspired desktop, developed from the open-source [webXP](https://github.com/aduncandev/web-xp).

## Current state

The original webXP application is pinned as a **Git submodule** at [upstream/web-xp](upstream/web-xp) (commit `bc9528db08c3714e6dfd52be43e1dcb3fe4a216a`). The upstream code and assets have not been copied into the PFx XP Git history. **PFx XP's customized application has not been built yet.**

### Preview the upstream application locally

```bash
git clone --recurse-submodules https://github.com/pfxamd/pfx-xp.git
cd pfx-xp/upstream/web-xp
npm ci
npm start
```

Visit `http://localhost:3000`. This runs the **upstream webXP**, not a completed PFx XP fork. Run `npm run build` inside the same directory to check production compilation. These commands run on your computer, not in GitHub Actions.

If you cloned without submodules, run `git submodule update --init --recursive` at the PFx XP repository root.

### Code-only review

```bash
bash tools/fetch-upstream.sh
```

This optional script obtains a pinned sparse source review copy under the Git-ignored `.upstream/web-xp` directory without modifying the application. It deliberately excludes asset directories and is not independently runnable.

## Provenance and legal notes

- Original project: [ShizukuIchi/winXP](https://github.com/ShizukuIchi/winXP).
- Selected upstream: [aduncandev/web-xp](https://github.com/aduncandev/web-xp), commit `bc9528db08c3714e6dfd52be43e1dcb3fe4a216a`.
- Code license: MIT, with attribution preserved in [LICENSE](LICENSE).
- Microsoft/Nintendo artwork, third-party games and sounds, personal content, and various fonts/assets are **not automatically covered by MIT**. Audit and replace or obtain appropriate rights before distributing customized builds.

## Development priorities

Preserve the XP shell, window manager, virtual filesystem and essential programs. Remove unrelated/personal content, replace media with permitted assets, harden storage and iframe isolation, and run regression tests locally. [Upstream assessment](docs/UPSTREAM-AUDIT.md).

**No GitHub Actions workflow is configured.**
