import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as bus from '../../src/core/window/shellBus.js';

test('window publication notifies only on observable changes', () => {
  const events = [];
  const off = bus.subscribe(windows => events.push(windows.map(w => w.title)));
  const win = { id: 999, title: 'Notepad', exePath: 'notepad.exe', minimized: false, maximized: false, hidden: false, focused: true };
  bus.publishWindows([win]);
  bus.publishWindows([{ ...win }]);
  assert.equal(events.length, 1);
  bus.publishWindows([{ ...win, title: 'Notes' }]);
  assert.deepEqual(events, [['Notepad'], ['Notes']]);
  off();
  bus.publishWindows([]);
  assert.equal(events.length, 2);
});

test('stale session cleanup cannot remove newer handlers', () => {
  const calls = [];
  const oldHandlers = { close: id => calls.push('old:' + id) };
  const newHandlers = { close: id => calls.push('new:' + id) };
  bus.registerWindowHandlers(oldHandlers);
  bus.registerWindowHandlers(newHandlers);
  bus.unregisterWindowHandlers(oldHandlers);
  bus.requestClose(123);
  assert.deepEqual(calls, ['new:123']);
  bus.unregisterWindowHandlers(newHandlers);
  bus.requestClose(124);
  assert.deepEqual(calls, ['new:123']);
});

test('close interceptors and taskbar geometry are unregisterable', () => {
  const veto = () => false;
  bus.setCloseInterceptor(567, veto);
  assert.equal(bus.getCloseInterceptor(567), veto);
  bus.setCloseInterceptor(567, null);
  assert.equal(bus.getCloseInterceptor(567), null);
  const rect = { left: 1, top: 2, width: 3, height: 4 };
  bus.setTaskbarButton(567, { getBoundingClientRect: () => rect });
  assert.equal(bus.getTaskbarRect(567), rect);
  bus.setTaskbarButton(567, null);
  assert.equal(bus.getTaskbarRect(567), null);
});
