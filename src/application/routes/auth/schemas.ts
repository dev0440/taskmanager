export const bodySchema = {
  type: 'object',
  properties: {
    password: {
      type: 'string',
      minLength: 8,
    },
    email: {
      type: 'string',
      format: 'email',
    },
  },
  required: ['password', 'email'],
};

export const responseSchema = {
  200: {
    type: 'object',
    properties: { email: { type: 'string' }, id: { type: 'string' } },
  },
};
