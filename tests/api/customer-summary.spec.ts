import { test, expect, request } from '@playwright/test';
import { ApiClient } from '../../src/test-support/services/ApiClient';
import { CustomerBuilder } from '../../src/test-support/factories/CustomerBuilder';

const baseURL = 'http://localhost:3000';

test.describe('API summary and detail flows', () => {
  test('Customer detail and summary endpoint return expected data', async () => {
    const apiClient = new ApiClient(await request.newContext({ baseURL }));
    await apiClient.login('admin@example.com', 'Admin123!');

    const payload = new CustomerBuilder().setName(`Summary Co ${Date.now()}`).setStatus('Pending').build();
    const createResponse = await apiClient.post('/api/customers', payload);
    expect(createResponse.status()).toBe(201);
    const createdCustomer = await createResponse.json();

    const detailResponse = await apiClient.get(`/api/customers/${createdCustomer.id}`);
    expect(detailResponse.ok()).toBeTruthy();
    const detailJson = await detailResponse.json();
    expect(detailJson).toMatchObject({ id: createdCustomer.id, name: payload.name, email: payload.email, status: payload.status });

    const summaryResponse = await apiClient.get('/api/summary');
    expect(summaryResponse.ok()).toBeTruthy();
    const summaryJson = await summaryResponse.json();
    expect(summaryJson.total).toBeGreaterThanOrEqual(1);
    expect(summaryJson.statusCounts[payload.status]).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(summaryJson.recentAudit)).toBeTruthy();
  });

  test('Bulk delete removes the selected customers', async () => {
    const apiClient = new ApiClient(await request.newContext({ baseURL }));
    await apiClient.login('admin@example.com', 'Admin123!');

    const first = new CustomerBuilder().setName(`BulkApiA ${Date.now()}`).build();
    const second = new CustomerBuilder().setName(`BulkApiB ${Date.now()}`).build();

    const firstResponse = await apiClient.post('/api/customers', first);
    const secondResponse = await apiClient.post('/api/customers', second);

    const firstCustomer = await firstResponse.json();
    const secondCustomer = await secondResponse.json();

    const bulkResponse = await apiClient.post('/api/customers/bulk-delete', { ids: [firstCustomer.id, secondCustomer.id] });
    const bulkResult = await bulkResponse.json();
    expect(bulkResult.removed).toBe(2);

    const searchResponse = await apiClient.get(`/api/customers?q=${encodeURIComponent('BulkApi')}`);
    const searchPayload = await searchResponse.json();
    expect(searchPayload.data).toEqual([]);
  });
});
