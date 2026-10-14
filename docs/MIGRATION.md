# Migration assessment

- Source: ShizukuIchi/winXP at `856bb554b3667f62078010b4cee10cc2645761e1` (2023-11-18).
- Current production branch stays unchanged at `2019826da6b9a26dfee928e9e967a63f5c12332b`.
- Backup ref: `backup/webxp-before-rebase`.
- Approach: immutable original source submodule, local Vite 6 workspace, React 18 entrypoint, existing first-party `src/core/` retained.
- No copying or editing old source media into our Git history.
- No GitHub Actions. No claim of browser verification.

## Acceptance gates

1. Install and build locally under Node 22.
2. Verify desktop, Start menu, draggable/minimizable windows, and original apps on Firefox and Chromium.
3. Integrate our independently tested reducer into original shell via adapter, without changing behavior.
4. Integrate persistence and file operations safely.
5. Test all app flows, then discuss promotion to `main`.
