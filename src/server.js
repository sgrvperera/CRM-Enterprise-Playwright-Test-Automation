const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('src/public'));

// In-memory stores
const users = [
  {
    id: 'u1',
    email: 'admin@example.com',
    password: 'Admin123!',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 'u2',
    email: 'viewer@example.com',
    password: 'Viewer123!',
    name: 'Viewer User',
    role: 'viewer',
  },
];

let customers = [
  { id: uuidv4(), name: 'Acme Corp', email: 'contact@acme.example', status: 'Active' },
  { id: uuidv4(), name: 'Globex', email: 'hello@globex.example', status: 'Prospect' },
];

// Simple token sim
function generateToken(user) {
  return Buffer.from(`${user.id}:${user.role}`).toString('base64');
}

function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.replace('Bearer ', '');
  try {
    const [id] = Buffer.from(token, 'base64').toString('utf8').split(':');
    const user = users.find((u) => u.id === id);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Auth
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.get('/api/me', authenticate, (req, res) => {
  const { id, email, name, role } = req.user;
  res.json({ id, email, name, role });
});

// Customers CRUD
app.get('/api/customers', authenticate, (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  );
  res.json(filtered);
});

app.post('/api/customers', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { name, email, status } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'Validation failed' });
  const c = { id: uuidv4(), name, email, status: status || 'Prospect' };
  customers.push(c);
  res.status(201).json(c);
});

app.put('/api/customers/:id', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const { name, email, status } = req.body || {};
  customers[idx] = {
    ...customers[idx],
    name: name || customers[idx].name,
    email: email || customers[idx].email,
    status: status || customers[idx].status,
  };
  res.json(customers[idx]);
});

app.delete('/api/customers/:id', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  customers = customers.filter((c) => c.id !== id);
  res.status(204).send();
});

// Serve simple index for convenience
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => console.log(`CRM demo server listening on http://localhost:${PORT}`));
