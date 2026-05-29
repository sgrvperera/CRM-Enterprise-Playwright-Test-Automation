import { Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/dashboard.html');
  }

  async total() {
    return Number(await this.page.locator('[data-testid="summary-total"]').innerText());
  }

  async active() {
    return Number(await this.page.locator('[data-testid="summary-active"]').innerText());
  }

  async pending() {
    return Number(await this.page.locator('[data-testid="summary-pending"]').innerText());
  }

  async activityCount() {
    return this.page.locator('[data-testid="activity-feed"] article').count();
  }

  async logout() {
    await Promise.all([
      this.page.waitForURL('**/'),
      this.page.click('[data-testid="logout"]'),
    ]);
  }
}
