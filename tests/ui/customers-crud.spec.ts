import { test, expect } from '../fixtures';
import { UsersPage } from '../pages/UsersPage';
import { createCustomerName } from '../data/customerFactory';

test.describe('Customers CRUD (UI)', () => {
  test('Create, edit, delete customer', async ({ loggedInPage: page }) => {
    const users = new UsersPage(page);
    const name = createCustomerName();
    await users.goto();
    await users.create(name, `${name.toLowerCase().replace(/\s+/g, '')}@example.com`);
    await expect(page.locator('table')).toContainText(name);

    // Edit: click first edit and update name
    await page.locator('button.edit').first().click();
    await page.fill('[data-testid="field-name"]', `${name} Ltd`);
    await page.click('[data-testid="modal-save"]');
    await expect(page.locator('table')).toContainText(`${name} Ltd`);

    // Delete
    page.on('dialog', (dialog) => dialog.accept());
    await page.locator('button.del').first().click();
    // assert removed
    await expect(page.locator('table')).not.toContainText(`${name} Ltd`);
  });
});
