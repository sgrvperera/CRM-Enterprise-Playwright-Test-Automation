import { test, expect } from '../../src/test-support/fixtures';
import { UsersPage } from '../../src/test-support/pages/UsersPage';

test('Viewer role cannot create customer from UI', async ({ viewerPage: page }) => {
  const users = new UsersPage(page);
  await users.goto();
  await users.create('Viewer Co', 'viewerco@example.com', 'Prospect');
  await expect(page.locator('[data-testid="form-error"]')).toContainText(/Forbidden|permission/i);
});
