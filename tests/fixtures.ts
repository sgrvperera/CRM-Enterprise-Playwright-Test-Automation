import { test as base, expect, Page } from '@playwright/test';

type Fixtures = {
  adminPage: Page;
  viewerPage: Page;
  loggedInPage: Page;
};

export const test = base.extend<Fixtures>({
  adminPage: async ({ page, request }, use) => {
    const res = await request.post('/api/auth/login', {
      data: { email: process.env.ADMIN_USER || 'admin@example.com', password: process.env.ADMIN_PASS || 'Admin123!' },
    });
    if (!res.ok()) throw new Error('API login failed');
    const body = await res.json();
    await page.goto('/');
    await page.evaluate((t) => localStorage.setItem('token', t), body.token);
    await page.goto('/dashboard.html');
    await use(page);
  },

  viewerPage: async ({ page, request }, use) => {
    const res = await request.post('/api/auth/login', { data: { email: 'viewer@example.com', password: 'Viewer123!' } });
    if (!res.ok()) throw new Error('Viewer API login failed');
    const body = await res.json();
    await page.goto('/');
    await page.evaluate((t) => localStorage.setItem('token', t), body.token);
    await page.goto('/dashboard.html');
    await use(page);
  },

  loggedInPage: async ({ adminPage }, use) => {
    await use(adminPage);
  },
});

export { expect };
