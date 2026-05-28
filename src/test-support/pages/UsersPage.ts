import { Page } from '@playwright/test';

export class UsersPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async goto() {
    await this.page.goto('/users.html');
  }
  async search(q: string) {
    await this.page.fill('[data-testid="search-input"]', q);
    await this.page.click('[data-testid="search-btn"]');
  }
  async create(name: string, email: string, status = 'Prospect') {
    await this.page.click('[data-testid="create-btn"]');
    await this.page.fill('[data-testid="field-name"]', name);
    await this.page.fill('[data-testid="field-email"]', email);
    await this.page.selectOption('[data-testid="field-status"]', status);
    await this.page.click('[data-testid="modal-save"]');
  }
  async hasCustomer(name: string) {
    return await this.page
      .locator('table')
      .innerText()
      .then((t) => t.includes(name));
  }
}
