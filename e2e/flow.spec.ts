import { test, expect } from '@playwright/test';

test.describe('/mobile (интерактивный flow)', () => {
  test('отображает интерактивный демо-блок и контролы шагов', async ({ page }) => {
    await page.goto('/mobile');
    await expect(page.locator('.flow-demo__eyebrow')).toContainText('Demo flow');
    await expect(page.locator('.iphone--flow')).toBeVisible();
    await expect(page.locator('.iphone__statusbar--kit')).toBeVisible();
    await expect(page.locator('.iphone-statusbar-svg--time')).toBeVisible();
    await expect(page.locator('.iphone-statusbar-svg--icons')).toBeVisible();
    await expect(page.getByRole('button', { name: /Сначала/ })).toBeVisible();
  });

  test('можно пройти по FSM до шага «Полная лента»', async ({ page }) => {
    await page.goto('/mobile');
    const next = page.getByRole('button', { name: 'Шаг →' });
    for (let i = 0; i < 6; i++) {
      await next.click();
    }
    await expect(page.locator('.flow-demo__progress-label')).toContainText('Полная лента');
  });
});
