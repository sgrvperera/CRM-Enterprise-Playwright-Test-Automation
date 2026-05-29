import { Page } from '@playwright/test';

export class UsersPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/users.html');
    await this.page.waitForSelector('[data-testid="customers-table-body"]');
  }

  async search(q: string) {
    await this.page.fill('[data-testid="search-input"]', q);
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes('/api/customers') && response.status() === 200),
      this.page.click('[data-testid="search-btn"]'),
    ]);
  }

  async create(name: string, email: string, status = 'Prospect') {
    await this.page.click('[data-testid="create-btn"]');
    await this.page.fill('[data-testid="field-name"]', name);
    await this.page.fill('[data-testid="field-email"]', email);
    await this.page.selectOption('[data-testid="field-status"]', status);
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes('/api/customers') && response.request().method() === 'POST'),
      this.page.click('[data-testid="modal-save"]'),
    ]);
  }

  async viewDetails(name: string) {
    const row = this.page.locator('tr', { hasText: name }).first();
    await Promise.all([
      this.page.waitForURL('**/customer-detail.html?*'),
      row.locator('[data-testid="view-details"]').click(),
    ]);
  }

  async selectCustomerByName(name: string) {
    const row = this.page.locator('tr', { hasText: name }).first();
    await row.locator('[data-testid="row-checkbox"]').check();
  }

  async bulkDelete() {
    this.page.once('dialog', (dialog) => dialog.accept());
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes('/api/customers/bulk-delete') && response.status() === 200),
      this.page.click('[data-testid="bulk-delete-btn"]'),
    ]);
  }

  async hasCustomer(name: string) {
    return this.page.locator('table').innerText().then((text) => text.includes(name));
  }
}
