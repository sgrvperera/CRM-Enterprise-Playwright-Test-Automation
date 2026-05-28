import { test, expect, request } from '@playwright/test';

test('API customers CRUD', async () => {
  const apiContext = await request.newContext({ baseURL: 'http://localhost:3000' });
  const login = await apiContext.post('/api/auth/login', {
    data: { email: 'admin@example.com', password: 'Admin123!' },
  });
  const { token } = await login.json();

  // Create
  const create = await apiContext.post('/api/customers', {
    headers: { Authorization: 'Bearer ' + token },
    data: { name: 'API Co', email: 'api@co.example' },
  });
  expect(create.status()).toBe(201);
  const created = await create.json();

  // Read
  const list = await apiContext.get('/api/customers', {
    headers: { Authorization: 'Bearer ' + token },
  });
  const all = await list.json();
  expect(Array.isArray(all)).toBeTruthy();

  // Update
  const update = await apiContext.put('/api/customers/' + created.id, {
    headers: { Authorization: 'Bearer ' + token },
    data: { name: 'API Co Ltd' },
  });
  expect(update.ok()).toBeTruthy();

  // Delete
  const del = await apiContext.delete('/api/customers/' + created.id, {
    headers: { Authorization: 'Bearer ' + token },
  });
  expect(del.status()).toBe(204);
});
