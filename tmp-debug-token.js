const http = require('http');
const { URL } = require('url');

function request(path, opts = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'http://localhost:3000');
    const lib = url.protocol === 'https:' ? require('https') : http;
    const req = lib.request(url, {
      method: opts.method || 'GET',
      headers: opts.headers || {},
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (opts.data) {
      req.write(JSON.stringify(opts.data));
    }
    req.end();
  });
}

(async () => {
  const login = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: { email: 'admin@example.com', password: 'Admin123!' },
  });
  const { token } = JSON.parse(login.body);
  const badToken = token.slice(0, -1) + (token.slice(-1) === 'A' ? 'B' : 'A');
  console.log('token', token);
  console.log('badToken', badToken);
  const decoded = Buffer.from(badToken, 'base64').toString('utf8');
  console.log('decoded tampered', decoded);
  console.log('parts', decoded.split(':'));
  const res = await request('/api/me', { headers: { Authorization: 'Bearer ' + badToken } });
  console.log('status', res.status);
  console.log('body', res.body);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});