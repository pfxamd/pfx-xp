# PFx XP core modules

These modules are owned by `pfx-xp`, adopted from the MIT-licensed source at [webXP](https://github.com/aduncandev/web-xp/tree/bc9528db08c3714e6dfd52be43e1dcb3fe4a216a) without changing their public APIs. The original authors' copyright is preserved in the repository [LICENSE](../../LICENSE).

- `vfsUtils.js`: path normalization, validation, file node metadata, MIME helpers.
- `vfs/nodeStore.js`: indexed virtual file tree and case-insensitive lookups.
- `window/shellBus.js`: shell event bus for window list and requests.

`tools/core-modules.mjs` maps these real first-party files into the ignored `.pfx-workspace` after the upstream source is staged. The upstream submodule remains immutable. These modules are independently testable via `npm run test:unit`.

The window reducer, UI, filesystem persistence, and applications **still come from upstream**. Copying these 3 modules is only the first dependency-reduction step, not a finished independent product.
