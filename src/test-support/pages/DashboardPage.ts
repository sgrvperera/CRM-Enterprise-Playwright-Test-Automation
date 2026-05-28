import { Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async countCustomers() {
    const text = await this.page.locator('[data-testid="card-customers"] #count').innerText();
    return parseInt(text, 10);
  }
  async gotoUsers() {
    await Promise.all([
      this.page.waitForURL('**/users.html'),
      this.page.click('[data-testid="link-users"]'),
    ]);
  }
}
