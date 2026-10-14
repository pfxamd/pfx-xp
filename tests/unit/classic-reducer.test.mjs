import test from 'node:test';
import assert from 'node:assert/strict';
import { createClassicWindowState } from '../../src/core/window/classicReducer.js';
import { FOCUSING, POWER_STATE } from '../../src/core/window/constants.js';
import { ADD_APP, FOCUS_APP, MINIMIZE_APP, TOGGLE_MAXIMIZE_APP, DEL_APP, FOCUS_DESKTOP, FOCUS_ICON, POWER_OFF, CANCEL_POWER_OFF } from '../../src/core/window/actions.js';

function setup() {
  return createClassicWindowState({ defaultAppState: [{ id: 0, zIndex: 0, component: 'Explorer', header: { title: 'Explorer' }, minimized: false, maximized: false }], defaultIconState: [{ id: 0, isFocus: false, component: 'Notepad' }], FOCUSING, POWER_STATE });
}
test('classic state retains original startup windows and desktop icons', () => {
  const { initState } = setup();
  assert.equal(initState.apps.length, 1); assert.equal(initState.icons.length, 1); assert.equal(initState.nextAppID, 1);
});
test('classic reducer handles focus, minimize, maximize and closing', () => {
  const { initState, reducer } = setup();
  const created = reducer(initState, { type: ADD_APP, payload: { component: 'Notepad', header: { title: 'Notepad' }, multiInstance: true } });
  assert.equal(created.apps[1].id, 1);
  const minimized = reducer(created, { type: MINIMIZE_APP, payload: 1 }); assert.equal(minimized.apps[1].minimized, true);
  const focus = reducer(minimized, { type: FOCUS_APP, payload: 1 }); assert.equal(focus.apps[1].minimized, false);
  const maximized = reducer(focus, { type: TOGGLE_MAXIMIZE_APP, payload: 1 }); assert.equal(maximized.apps[1].maximized, true);
  assert.equal(reducer(maximized, { type: DEL_APP, payload: 1 }).apps.length, 1);
});
test('classic reducer preserves desktop icons and shutdown behavior', () => {
  const { initState, reducer } = setup();
  const icon = reducer(initState, { type: FOCUS_ICON, payload: 0 }); assert.equal(icon.icons[0].isFocus, true);
  const desktop = reducer(icon, { type: FOCUS_DESKTOP }); assert.equal(desktop.icons[0].isFocus, false);
  const off = reducer(desktop, { type: POWER_OFF, payload: POWER_STATE.TURN_OFF });
  assert.equal(reducer(off, { type: CANCEL_POWER_OFF }).powerState, POWER_STATE.START);
});
