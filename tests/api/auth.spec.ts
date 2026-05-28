import { test, expect, request } from '@playwright/test';
import { ApiClient } from '../../src/test-support/services/ApiClient';

test('API auth returns token and allows /me', async () => {
  const api = new ApiClient(await request.newContext({ baseURL: 'http://localhost:3000' }));
  const authResponse = await api.login('admin@example.com', 'Admin123!');
  expect(authResponse.token).toBeTruthy();

  const meResponse = await api.get('/api/me');
  expect(meResponse.ok()).toBeTruthy();
  const meJson = await meResponse.json();
  expect(meJson.email).toBe('admin@example.com');
});
