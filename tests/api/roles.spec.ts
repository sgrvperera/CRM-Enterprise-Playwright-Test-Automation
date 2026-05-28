import { test, expect, request } from '@playwright/test';

test('Viewer role cannot create customer via API', async () => {
  const api = await request.newContext({ baseURL: 'http://localhost:3000' });
  const login = await api.post('/api/auth/login', { data: { email: 'viewer@example.com', password: 'Viewer123!' } });
  expect(login.ok()).toBeTruthy();
  const { token } = await login.json();
  const res = await api.post('/api/customers', { headers: { Authorization: 'Bearer ' + token }, data: { name: 'BadCo', email: 'bad@co.example' } });
  expect(res.status()).toBe(403);
});
