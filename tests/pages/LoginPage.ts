import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async goto() {
    await this.page.goto('/');
  }
  async login(email: string, password: string) {
    await this.page.fill('[data-testid="login-email"]', email);
    await this.page.fill('[data-testid="login-password"]', password);
    await Promise.all([
      this.page.waitForURL('**/dashboard.html'),
      this.page.click('[data-testid="login-submit"]'),
    ]);
  }
}
