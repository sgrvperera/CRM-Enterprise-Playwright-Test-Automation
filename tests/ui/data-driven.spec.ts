import { test, expect } from '../fixtures';
import { UsersPage } from '../pages/UsersPage';

const rows = [
  { name: 'Acme Data 1', email: 'acme1@example.com', status: 'Active' },
  { name: 'Beta Data 2', email: 'beta2@example.com', status: 'Prospect' },
];

for (const r of rows) {
  test(`Data-driven create customer: ${r.name}`, async ({ loggedInPage: page }) => {
    const users = new UsersPage(page);
    await users.goto();
    await users.create(r.name, r.email, r.status);
    await expect(page.locator('table')).toContainText(r.name);
  });
}
