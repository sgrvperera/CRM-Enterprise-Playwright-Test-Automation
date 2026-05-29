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

    const updatedName = `${customer.name} Ltd`;
    const customerRow = page.locator('tr', { hasText: customer.name }).first();
    await customerRow.locator('[data-testid="edit-btn"]').click();
    await page.fill('[data-testid="field-name"]', updatedName);
    await page.click('[data-testid="modal-save"]');
    await expect(page.locator('table')).toContainText(updatedName);

    const updatedRow = page.locator('tr', { hasText: updatedName }).first();
    page.on('dialog', (dialog) => dialog.accept());
    await updatedRow.locator('[data-testid="delete-btn"]').click();
    await page.waitForTimeout(500);

    const postDeleteList = await adminApi.get(`/api/customers?q=${encodeURIComponent(updatedName)}`);
    const postDeletePayload = await postDeleteList.json();
    const existsAfter = (postDeletePayload.data || []).some((item: any) => item.name === updatedName);
    expect(existsAfter).toBeFalsy();
  });
});
