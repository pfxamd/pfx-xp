# First-party PFx XP core

Preserved from the earlier PFx XP development under the MIT terms in [LICENSE](../../LICENSE).

- `vfsUtils.js` and `vfs/nodeStore.js` — filesystem utility functions and indexed path nodes.
- `window/reducer.js`, `window/actions.js`, `window/constants.js` — newer standalone window state machine.
- `window/shellBus.js` and `window/adapter.js` — window communication and browser adapter.

**Integration status:** retained and tested independently. These APIs were developed against the later webXP fork; they are *not* directly compatible with the 2019 original desktop's initial state or window records. Do not replace the original reducer until a compatibility adapter and browser tests exist. The original desktop remains untouched in the pinned submodule.
