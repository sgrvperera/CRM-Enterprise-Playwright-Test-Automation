import { test, expect } from '../../src/test-support/fixtures';
import { UsersPage } from '../../src/test-support/pages/UsersPage';
import { CustomerBuilder } from '../../src/test-support/factories/CustomerBuilder';

test.describe('Customers CRUD (UI)', () => {
  test('Create, edit, delete customer', async ({ loggedInPage: page, adminApi }) => {
    const users = new UsersPage(page);
    const customer = new CustomerBuilder().setName(`Enterprise Co ${Date.now()}`).setStatus('Active').build();
    await users.goto();
    await users.create(customer.name, customer.email, customer.status);
    await expect(page.locator('table')).toContainText(customer.name);

    const listResponse = await adminApi.get(`/api/customers?q=${encodeURIComponent(customer.name)}`);
    const listPayload = await listResponse.json();
    const list = listPayload.data || [];
    expect(list.some((item: any) => item.name === customer.name)).toBeTruthy();

    await page.locator('button.edit').first().click();
    await page.fill('[data-testid="field-name"]', `${customer.name} Ltd`);
    await page.click('[data-testid="modal-save"]');
    await expect(page.locator('table')).toContainText(`${customer.name} Ltd`);

    page.on('dialog', (dialog) => dialog.accept());
    await page.locator('button.del').first().click();
    await expect(page.locator('table')).not.toContainText(`${customer.name} Ltd`);
  });
});
