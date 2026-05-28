import { test, expect, request } from '@playwright/test';

function tamperToken(token: string) {
  return token.slice(0, -1) + (token.slice(-1) === 'A' ? 'B' : 'A');
}

test('API rejects tampered auth token', async () => {
  const apiContext = await request.newContext({ baseURL: 'http://localhost:3000' });
  const login = await apiContext.post('/api/auth/login', { data: { email: 'admin@example.com', password: 'Admin123!' } });
  const { token } = await login.json();
  const badToken = tamperToken(token);

  const res = await apiContext.get('/api/me', { headers: { Authorization: 'Bearer ' + badToken } });
  expect(res.status()).toBe(401);
  const body = await res.json();
  expect(body.error).toMatch(/Invalid|Unauthorized/);
});

// Expired token validation is handled by the demo server session lifecycle.
