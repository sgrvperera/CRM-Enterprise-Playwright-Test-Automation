import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Negative login shows error', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await page.fill('[data-testid="login-email"]', 'wrong@example.com');
  await page.fill('[data-testid="login-password"]', 'bad');
  await page.click('[data-testid="login-submit"]');
  await expect(page.locator('[data-testid="login-message"]')).toHaveText(/Invalid|Login failed/);
});
