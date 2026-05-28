const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'super-secure-demo-secret';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('src/public'));

const users = [
  {
    id: 'u1',
    email: 'admin@example.com',
    password: 'Admin123!',
    name: 'Admin User',
    role: 'admin',
    locked: false,
  },
  {
    id: 'u2',
    email: 'viewer@example.com',
    password: 'Viewer123!',
    name: 'Viewer User',
    role: 'viewer',
    locked: false,
  },
];

let customers = [
  { id: uuidv4(), name: 'Acme Corp', email: 'contact@acme.example', status: 'Active' },
  { id: uuidv4(), name: 'Globex', email: 'hello@globex.example', status: 'Prospect' },
];

const sessions = [];
const auditLogs = [];
const settings = {
  maintenanceMode: false,
  defaultCustomerStatus: 'Prospect',
};

function now() {
  return new Date().toISOString();
}

function logAudit(user, action, details = '') {
  auditLogs.unshift({ id: uuidv4(), timestamp: now(), userId: user.id, action, details });
}

function createTokenSignature(raw) {
  return crypto.createHmac('sha256', TOKEN_SECRET).update(raw).digest('hex');
}

function generateToken(user) {
  const expiresAt = Date.now() + 15 * 60 * 1000;
  const sessionId = uuidv4();
  const raw = `${sessionId}:${user.id}:${user.role}:${expiresAt}`;
  const signature = createTokenSignature(raw);
  sessions.push({ id: sessionId, userId: user.id, expiresAt, active: true });
  return Buffer.from(`${raw}:${signature}`).toString('base64');
}

function parseToken(token) {
  try {
    const buffer = Buffer.from(token, 'base64');
    if (buffer.toString('base64') !== token) return null;
    const [sessionId, userId, role, expiresAt, signature] = buffer.toString('utf8').split(':');
    if (!sessionId || !userId || !role || !expiresAt || !signature) return null;
    const raw = `${sessionId}:${userId}:${role}:${expiresAt}`;
    if (createTokenSignature(raw) !== signature) return null;
    return { sessionId, userId, role, expiresAt: Number(expiresAt) };
  } catch (error) {
    return null;
  }
}

function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.replace('Bearer ', '');
  const parsed = parseToken(token);
  if (!parsed) return res.status(401).json({ error: 'Invalid token' });

  const session = sessions.find((s) => s.id === parsed.sessionId);
  if (!session || !session.active) return res.status(401).json({ error: 'Session invalid or expired' });
  if (Date.now() > parsed.expiresAt) {
    session.active = false;
    return res.status(401).json({ error: 'Session expired' });
  }

  const user = users.find((u) => u.id === parsed.userId);
  if (!user) return res.status(401).json({ error: 'Invalid user' });
  if (user.locked) return res.status(403).json({ error: 'User account locked' });

  req.user = user;
  req.session = session;
  next();
}

function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}

function buildCustomerQuery(filters) {
  return customers
    .filter((c) => {
      const text = (filters.q || '').toLowerCase();
      const matchStatus = filters.status ? c.status === filters.status : true;
      const matchText = !text || c.name.toLowerCase().includes(text) || c.email.toLowerCase().includes(text);
      return matchStatus && matchText;
    })
    .sort((first, second) => {
      if (filters.sort === 'name') return first.name.localeCompare(second.name);
      if (filters.sort === 'status') return first.status.localeCompare(second.status);
      return 0;
    });
}

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (user.locked) return res.status(403).json({ error: 'Account locked' });

  const token = generateToken(user);
  logAudit(user, 'login', `User logged in`);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.post('/api/auth/logout', authenticate, (req, res) => {
  req.session.active = false;
  logAudit(req.user, 'logout', 'User logged out');
  res.json({ success: true });
});

app.post('/api/auth/logout-all', authenticate, requireAdmin, (req, res) => {
  sessions.forEach((session) => {
    if (session.userId !== req.user.id) session.active = false;
  });
  logAudit(req.user, 'logout_all', 'Admin invalidated all sessions');
  res.json({ success: true });
});

app.get('/api/me', authenticate, (req, res) => {
  const { id, email, name, role } = req.user;
  res.json({ id, email, name, role });
});

app.get('/api/customers', authenticate, (req, res) => {
  const filters = { q: req.query.q || '', status: req.query.status || '', sort: req.query.sort || '' };
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 10);
  const results = buildCustomerQuery(filters);
  const paged = results.slice((page - 1) * pageSize, page * pageSize);
  res.json({ meta: { total: results.length, page, pageSize }, data: paged });
});

app.post('/api/customers', authenticate, requireAdmin, (req, res) => {
  const { name, email, status } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'Validation failed' });
  const customer = { id: uuidv4(), name, email, status: status || settings.defaultCustomerStatus };
  customers.push(customer);
  logAudit(req.user, 'customer_create', `Created customer ${customer.name}`);
  res.status(201).json(customer);
});

app.put('/api/customers/:id', authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const customer = customers.find((c) => c.id === id);
  if (!customer) return res.status(404).json({ error: 'Not found' });
  const { name, email, status } = req.body || {};
  customer.name = name || customer.name;
  customer.email = email || customer.email;
  customer.status = status || customer.status;
  logAudit(req.user, 'customer_update', `Updated customer ${customer.name}`);
  res.json(customer);
});

app.delete('/api/customers/:id', authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const customer = customers.find((c) => c.id === id);
  if (!customer) return res.status(404).json({ error: 'Not found' });
  customers = customers.filter((c) => c.id !== id);
  logAudit(req.user, 'customer_delete', `Deleted customer ${customer.name}`);
  res.status(204).send();
});

app.get('/api/users', authenticate, requireAdmin, (req, res) => {
  res.json(users.map(({ password, ...rest }) => rest));
});

app.put('/api/users/:id/lock', authenticate, requireAdmin, (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  user.locked = Boolean(req.body.locked);
  logAudit(req.user, 'user_lock', `Set lock=${user.locked} for ${user.email}`);
  res.json({ id: user.id, locked: user.locked });
});

app.put('/api/users/:id/role', authenticate, requireAdmin, (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  const { role } = req.body || {};
  if (!role || !['admin', 'viewer'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
  user.role = role;
  logAudit(req.user, 'user_role_change', `Changed role to ${role} for ${user.email}`);
  res.json({ id: user.id, role: user.role });
});

app.get('/api/audit-logs', authenticate, requireAdmin, (req, res) => {
  res.json(auditLogs.slice(0, 50));
});

app.get('/api/admin/settings', authenticate, requireAdmin, (req, res) => {
  res.json(settings);
});

app.put('/api/admin/settings', authenticate, requireAdmin, (req, res) => {
  const { maintenanceMode, defaultCustomerStatus } = req.body || {};
  if (typeof maintenanceMode === 'boolean') settings.maintenanceMode = maintenanceMode;
  if (defaultCustomerStatus) settings.defaultCustomerStatus = defaultCustomerStatus;
  logAudit(req.user, 'settings_update', `Updated admin settings`);
  res.json(settings);
});

app.get('/api/meta/sessions', authenticate, requireAdmin, (req, res) => {
  res.json(sessions);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => console.log(`CRM demo server listening on http://localhost:${PORT}`));
