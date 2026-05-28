export const authResponseSchema = {
  type: 'object',
  required: ['token', 'user'],
  properties: {
    token: { type: 'string' },
    user: {
      type: 'object',
      required: ['id', 'email', 'name', 'role'],
      properties: {
        id: { type: 'string' },
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
        role: { type: 'string' },
      },
    },
  },
};

export const customerSchema = {
  type: 'object',
  required: ['id', 'name', 'email', 'status'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    status: { type: 'string' },
  },
};

export const customerListSchema = {
  type: 'array',
  items: customerSchema,
};

export const errorSchema = {
  type: 'object',
  required: ['error'],
  properties: {
    error: { type: 'string' },
  },
};
