import { test, expect } from '../../src/test-support/fixtures';
import { DashboardPage } from '../../src/test-support/pages/DashboardPage';

test.describe('Dashboard flows', () => {
  test('Dashboard shows KPI cards and recent activity', async ({ loggedInPage: page }) => {
    const dashboard = new DashboardPage(page);
    expect(await dashboard.total()).toBeGreaterThanOrEqual(0);
    expect(await dashboard.active()).toBeGreaterThanOrEqual(0);
    expect(await dashboard.pending()).toBeGreaterThanOrEqual(0);
    expect(await dashboard.activityCount()).toBeGreaterThanOrEqual(0);
  });

  test('Admin logout returns to login page', async ({ loggedInPage: page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.logout();
    await expect(page.locator('[data-testid="login-submit"]')).toBeVisible();
  });
});
