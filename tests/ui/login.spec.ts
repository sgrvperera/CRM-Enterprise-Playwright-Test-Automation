import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Auth flow', () => {
  test('Login and redirect to dashboard', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('admin@example.com', 'Admin123!');
    await expect(page.locator('[data-testid="card-customers"]')).toContainText('Customers');
  });
});
