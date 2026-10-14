# PFx XP core modules

These modules are owned by `pfx-xp`, adopted from the MIT-licensed source at [webXP](https://github.com/aduncandev/web-xp/tree/bc9528db08c3714e6dfd52be43e1dcb3fe4a216a) without changing their public APIs. The original authors' copyright is preserved in the repository [LICENSE](../../LICENSE).

- `vfsUtils.js`: path normalization, validation, file node metadata, MIME helpers.
- `vfs/nodeStore.js`: indexed virtual file tree and case-insensitive lookups.
- `window/shellBus.js`: shell event bus for window list and requests.
- `window/reducer.js`, `window/actions.js`, `window/constants.js`: platform-owned window state machine, independently testable with host-injected stage size and ID sequence.
- `window/adapter.js`: browser shim, preserves the upstream export contract, stable IDs and live screen dimensions.

`tools/core-modules.mjs` maps these real first-party files into the ignored `.pfx-workspace` after the upstream source is staged. The upstream submodule remains immutable. These modules are independently testable via `npm run test:unit`.

The UI, filesystem persistence, and most applications **still come from upstream**. Copying these 3 modules is only the first dependency-reduction step, not a finished independent product.
