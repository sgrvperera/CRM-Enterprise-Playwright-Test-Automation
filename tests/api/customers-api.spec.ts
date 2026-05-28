import { test, expect, request } from '@playwright/test';
import { ApiClient } from '../../src/test-support/services/ApiClient';
import { CustomerBuilder } from '../../src/test-support/factories/CustomerBuilder';

test('API customers CRUD', async () => {
  const apiClient = new ApiClient(await request.newContext({ baseURL: 'http://localhost:3000' }));
  await apiClient.login('admin@example.com', 'Admin123!');
  const payload = new CustomerBuilder().setName(`API Co ${Date.now()}`).setStatus('Active').build();

  const create = await apiClient.post('/api/customers', payload);
  expect(create.status()).toBe(201);
  const created = await create.json();

  const listResponse = await apiClient.get('/api/customers?q=' + encodeURIComponent(payload.name));
  const payloadData = await listResponse.json();
  const all = payloadData.data || [];
  expect(Array.isArray(all)).toBeTruthy();
  expect(all.some((item: any) => item.id === created.id)).toBeTruthy();

  const update = await apiClient.put('/api/customers/' + created.id, { name: `${payload.name} Ltd` });
  expect(update.ok()).toBeTruthy();

  const del = await apiClient.delete('/api/customers/' + created.id);
  expect(del.status()).toBe(204);
});
