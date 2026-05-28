import { test, expect, request } from '@playwright/test';
import { ApiClient } from '../../src/test-support/services/ApiClient';

test('Viewer role cannot create customer via API', async () => {
  const apiClient = new ApiClient(await request.newContext({ baseURL: 'http://localhost:3000' }));
  await apiClient.login('viewer@example.com', 'Viewer123!');
  const res = await apiClient.post('/api/customers', { name: 'BadCo', email: 'bad@co.example' });
  expect(res.status()).toBe(403);
});
