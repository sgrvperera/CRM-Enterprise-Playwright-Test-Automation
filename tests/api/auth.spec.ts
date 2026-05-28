import { test, expect, request } from '@playwright/test';

test('API auth returns token and allows /me', async () => {
  const apiContext = await request.newContext({ baseURL: 'http://localhost:3000' });
  const res = await apiContext.post('/api/auth/login', {
    data: { email: 'admin@example.com', password: 'Admin123!' },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.token).toBeTruthy();
  const me = await apiContext.get('/api/me', {
    headers: { Authorization: 'Bearer ' + body.token },
  });
  expect(me.ok()).toBeTruthy();
  const meJson = await me.json();
  expect(meJson.email).toBe('admin@example.com');
});
