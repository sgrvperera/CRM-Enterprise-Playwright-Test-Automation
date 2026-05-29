import { Page } from '@playwright/test';

export class CustomerDetailPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(customerId: string) {
    await this.page.goto(`/customer-detail.html?id=${customerId}`);
    await this.page.waitForSelector('[data-testid="customer-name"]');
  }

  async name() {
    return this.page.locator('[data-testid="customer-name"]').innerText();
  }

  async email() {
    return this.page.locator('[data-testid="customer-email"]').innerText();
  }

  async status() {
    return this.page.locator('[data-testid="customer-status"]').innerText();
  }

  async created() {
    return this.page.locator('[data-testid="customer-created"]').innerText();
  }

  async notes() {
    return this.page.locator('[data-testid="customer-notes"]').innerText();
  }
}
