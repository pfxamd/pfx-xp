# PFx XP

A browser-based Windows XP-inspired desktop, developed from the open-source [webXP](https://github.com/aduncandev/web-xp) project.

**Status:** preparation and source audit. The upstream application has **not** been copied into this repository yet; the repository is not currently runnable.

## Source

- Upstream: `aduncandev/web-xp`
- Pinned source revision: `bc9528db08c3714e6dfd52be43e1dcb3fe4a216a` (2026-09-03)
- Upstream's original ancestor: `ShizukuIchi/winXP`
- Code license: MIT; see [LICENSE](LICENSE) and upstream credits.
- Source media, game assets, brands, fonts and sounds have **separate copyright restrictions**. Do not assume they are MIT-licensed.

## Safe local source review

On Linux, with Git installed:

```bash
bash tools/fetch-upstream.sh
```

This fetches a pinned **code-only review copy** into the Git-ignored `.upstream/web-xp` directory. It does not modify tracked project files, publish the upstream project, or run GitHub Actions. The staged copy is **not buildable** without the omitted media assets.

For the detailed migration and security checklist, see [docs/UPSTREAM-AUDIT.md](docs/UPSTREAM-AUDIT.md).

## Direction

Preserve the shell, window manager, virtual filesystem and core apps; remove project-specific extras; replace or properly license media; secure account storage and embedded content; and test locally before publishing any application build.
