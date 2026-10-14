import { test, expect } from './fixtures';

test('first-party window reducer is integrated with the XP shell', async ({ page }) => {
  await page.goto('/');
  const state = await page.evaluate(async () => {
    const [{ initState, reducer }, { ADD_APP }] = await Promise.all([
      import('/src/WinXP/reducer.js'),
      import('/src/WinXP/constants/actions.js'),
    ]);
    const next = reducer(initState, {
      type: ADD_APP,
      payload: {
        exePath: 'C:/mock.exe', component: 'mock', header: { title: 'Mock' },
        defaultOffset: { x: 10, y: 10 }, defaultSize: { width: 300, height: 200 },
        resizable: true, multiInstance: false,
      },
    });
    return { count: next.apps.length, id: next.apps[0].id, width: next.apps[0].size.width };
  });
  expect(state.count).toBe(1);
  expect(state.id).toBeGreaterThan(0);
  expect(state.width).toBe(300);
});
