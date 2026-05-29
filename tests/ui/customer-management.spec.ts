import { test, expect } from '../../src/test-support/fixtures';
import { UsersPage } from '../../src/test-support/pages/UsersPage';
import { CustomerDetailPage } from '../../src/test-support/pages/CustomerDetailPage';
import { CustomerBuilder } from '../../src/test-support/factories/CustomerBuilder';

test.describe('Customer management flows', () => {
  test('Admins can view customer detail from the customer list', async ({ loggedInPage: page, adminApi }) => {
    const users = new UsersPage(page);
    const customer = new CustomerBuilder().setName(`Detail Co ${Date.now()}`).setStatus('Active').build();

    const createResponse = await adminApi.post('/api/customers', customer);
    const createdCustomer = await createResponse.json();

    await users.goto();
    await users.search(customer.name);
    await users.viewDetails(customer.name);

    const detail = new CustomerDetailPage(page);
    await expect(page).toHaveURL(new RegExp(`/customer-detail.html\\?id=${createdCustomer.id}`));
    await expect(page.locator('[data-testid="customer-name"]')).toHaveText(customer.name);
    await expect(page.locator('[data-testid="customer-email"]')).toHaveText(customer.email);
    await expect(page.locator('[data-testid="customer-status"]')).toHaveText(customer.status);
    await expect(page.locator('[data-testid="customer-created"]')).not.toHaveText('Loading');
    await expect(page.locator('[data-testid="customer-notes"]')).not.toHaveText(/Loading/);
  });

  test('Admins can bulk delete selected customers from the list', async ({ loggedInPage: page, adminApi }) => {
    const users = new UsersPage(page);
    const first = new CustomerBuilder().setName(`Bulk A ${Date.now()}`).setStatus('Prospect').build();
    const second = new CustomerBuilder().setName(`Bulk B ${Date.now()}`).setStatus('Prospect').build();

    await adminApi.post('/api/customers', first);
    await adminApi.post('/api/customers', second);

    await users.goto();
    await users.search('Bulk');
    await users.selectCustomerByName(first.name);
    await users.selectCustomerByName(second.name);
    await users.bulkDelete();

    await expect(page.locator('table')).not.toContainText(first.name);
    await expect(page.locator('table')).not.toContainText(second.name);
  });
});
