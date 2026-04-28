import { test, expect } from '@playwright/test';

test.describe('/flow', () => {
  test('отображает интерактивный демо-блок и контролы шагов', async ({ page }) => {
    await page.goto('/flow');
    await expect(page.locator('.flow-demo__eyebrow')).toContainText('Demo flow');
    await expect(page.locator('.iphone--flow')).toBeVisible();
    await expect(page.getByRole('button', { name: /Сначала/ })).toBeVisible();
  });

  test('можно пройти по FSM до шага «Полная лента»', async ({ page }) => {
    await page.goto('/flow');
    const next = page.getByRole('button', { name: 'Шаг →' });
    for (let i = 0; i < 6; i++) {
      await next.click();
    }
    await expect(page.locator('.flow-demo__progress-label')).toContainText('Полная лента');
  });
});
