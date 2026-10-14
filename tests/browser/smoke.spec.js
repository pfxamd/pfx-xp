import { test, expect } from '@playwright/test';

test('classic XP desktop renders the taskbar, icons and windows', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Notepad', { exact: true }).first()).toBeVisible();
  await expect(page.locator('.app__header__title').first()).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
});

test('Notepad saves a real file and My Computer opens it after reload', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Notepad', { exact: true }).first().dblclick();
  const editor = page.locator('textarea').last();
  await expect(editor).toBeVisible();
  await editor.fill('PFx XP persistent document');
  page.on('dialog', dialog => dialog.accept(dialog.type() === 'prompt' ? 'smoke.txt' : undefined));
  await editor.press('Control+s');
  await expect(page.getByRole('status')).toContainText('Saved:');
  await page.reload();
  const files = page.locator('[data-pfx-documents]');
  await expect(files).toContainText('smoke.txt');
  await files.getByRole('button', { name: 'smoke.txt' }).click();
  await expect(page.locator('textarea').last()).toHaveValue('PFx XP persistent document');
});
