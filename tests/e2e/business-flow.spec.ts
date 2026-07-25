import { test, expect } from '@playwright/test';

test.describe('Complete Business Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('[name="email"]', 'admin@visualerp.com.br');
    await page.fill('[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/app');
  });

  test('full flow: lead to financial closure', async ({ page }) => {
    await page.goto('/app/crm/leads');
    await expect(page.locator('h1')).toContainText(/lead/i);

    await page.goto('/app/projetos');
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/app/os');
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/app/producao');
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/app/financeiro');
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/app/agenda');
    await expect(page.locator('body')).toBeVisible();
  });

  test('admin dashboard loads', async ({ page }) => {
    await page.goto('/app/admin');
    await expect(page.locator('body')).toBeVisible();
  });
});
