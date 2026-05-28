import { Page } from '@playwright/test';

export async function loginByApi(page: Page, email = 'admin@example.com', password = 'Admin123!') {
  const res = await page.request.post('/api/auth/login', { data: { email, password } });
  if (!res.ok()) throw new Error('API login failed');
  const body = await res.json();
  // set token in localStorage and navigate
  await page.goto('/');
  await page.evaluate((token) => localStorage.setItem('token', token), body.token);
  await page.goto('/dashboard.html');
}
