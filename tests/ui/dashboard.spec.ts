import { test, expect } from '../../src/test-support/fixtures';

test('Dashboard shows customer count', async ({ loggedInPage: page }) => {
  const countText = await page.locator('[data-testid="card-customers"] #count').innerText();
  const count = parseInt(countText, 10);
  expect(count).toBeGreaterThanOrEqual(0);
});
