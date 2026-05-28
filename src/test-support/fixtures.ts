import { test as base, expect, Page } from '@playwright/test';
import { ApiClient } from './services/ApiClient';
import { AuthService } from './services/AuthService';

type Fixtures = {
  adminPage: Page;
  viewerPage: Page;
  adminApi: ApiClient;
  viewerApi: ApiClient;
  loggedInPage: Page;
};

export const test = base.extend<Fixtures>({
  adminApi: async ({ request }, use) => {
    const apiClient = new ApiClient(request);
    const auth = new AuthService(apiClient, 'admin');
    await auth.authenticate();
    await use(apiClient);
  },

  viewerApi: async ({ request }, use) => {
    const apiClient = new ApiClient(request);
    const auth = new AuthService(apiClient, 'viewer');
    await auth.authenticate();
    await use(apiClient);
  },

  adminPage: async ({ page, adminApi }, use) => {
    const token = adminApi.token;
    if (!token) throw new Error('Admin auth token is not available');
    await page.goto('/');
    await page.evaluate((storageToken: string) => localStorage.setItem('token', storageToken), token);
    await page.goto('/dashboard.html');
    await use(page);
  },

  viewerPage: async ({ page, viewerApi }, use) => {
    const token = viewerApi.token;
    if (!token) throw new Error('Viewer auth token is not available');
    await page.goto('/');
    await page.evaluate((storageToken: string) => localStorage.setItem('token', storageToken), token);
    await page.goto('/dashboard.html');
    await use(page);
  },

  loggedInPage: async ({ adminPage }, use) => {
    await use(adminPage);
  },
});

export { expect };
