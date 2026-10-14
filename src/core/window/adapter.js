// Browser integration for the platform-owned, UI-independent reducer.
import { screenSize } from './screen';
import { createWindowStateMachine } from '../core/window/reducer.js';

// The browser-level sequence survives Vite hot module replacement and is
// shared by mounted sessions that use the global window event bus.
if (window.__winxpWindowIdSeq == null) window.__winxpWindowIdSeq = 1;

export const { initState, reducer } = createWindowStateMachine({
  screenSize,
  nextWindowId: () => window.__winxpWindowIdSeq++,
});
