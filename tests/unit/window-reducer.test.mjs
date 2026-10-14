import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWindowStateMachine } from '../../src/core/window/reducer.js';
import { ADD_APP, DEL_APP, FOCUS_APP, MINIMIZE_APP, MINIMIZE_ALL, CASCADE_WINDOWS, TILE_WINDOWS_VERTICALLY } from '../../src/core/window/actions.js';

function machine() {
  let id = 100;
  return createWindowStateMachine({
    screenSize: () => ({ width: 1000, height: 700 }),
    nextWindowId: () => ++id,
  });
}

function entry(exePath, extra = {}) {
  return {
    exePath,
    component: exePath,
    header: { title: exePath },
    defaultOffset: { x: 15, y: 20 },
    defaultSize: { width: 500, height: 300 },
    multiInstance: false,
    resizable: true,
    ...extra,
  };
}

test('the platform reducer allocates unique ids, focuses and minimizes windows', () => {
  const { reducer, initState } = machine();
  const a = reducer(initState, { type: ADD_APP, payload: entry('notepad.exe') });
  assert.equal(a.apps[0].id, 101);
  assert.equal(initState.apps.length, 0);
  const b = reducer(a, { type: ADD_APP, payload: entry('calc.exe') });
  assert.equal(b.apps[1].id, 102);
  const c = reducer(b, { type: MINIMIZE_APP, payload: 101 });
  assert.equal(c.apps[0].minimized, true);
  const d = reducer(c, { type: FOCUS_APP, payload: 101 });
  assert.equal(d.apps[0].minimized, false);
  assert.equal(d.apps[0].zIndex > d.apps[1].zIndex, true);
  assert.equal(reducer(d, { type: DEL_APP, payload: 101 }).apps.length, 1);
});

test('relaunching a single-instance app merges file-open arguments', () => {
  const { reducer, initState } = machine();
  const a = reducer(initState, { type: ADD_APP, payload: entry('notepad.exe', { injectProps: { filePath: 'C:/old.txt' } }) });
  const b = reducer(a, { type: ADD_APP, payload: entry('notepad.exe', { injectProps: { filePath: 'C:/new.txt' } }) });
  assert.equal(b.apps.length, 1);
  assert.equal(b.apps[0].id, a.apps[0].id);
  assert.equal(b.apps[0].injectProps.filePath, 'C:/new.txt');
});

test('window arrangement preserves windows and respects non-minimizable flags', () => {
  const { reducer, initState } = machine();
  let state = reducer(initState, { type: ADD_APP, payload: entry('one.exe') });
  state = reducer(state, { type: ADD_APP, payload: entry('two.exe', { header: { title: 'two', noMinimize: true } }) });
  const arranged = reducer(state, { type: CASCADE_WINDOWS, payload: { width: 1100, height: 740 } });
  assert.equal(arranged.apps.length, 2);
  assert.equal(arranged.apps.every(a => a.size.width > 0 && a.size.height > 0), true);
  const tiled = reducer(arranged, { type: TILE_WINDOWS_VERTICALLY, payload: { width: 1100, height: 740 } });
  assert.equal(tiled.apps.length, 2);
  const minimized = reducer(tiled, { type: MINIMIZE_ALL });
  assert.equal(minimized.apps[0].minimized, true);
  assert.equal(minimized.apps[1].minimized, false);
});
