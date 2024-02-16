import fastify from 'fastify';
import signup from './signup';

const buildFastify = () => {
  const app = fastify({});
  app.register(signup);
  return app;
};

describe('Signup routes', () => {
  it('should signup user', async () => {
    const app = buildFastify();

    const res = await app.inject({
      method: 'POST',
      path: '/signup',
      body: {
        email: 'test@email.com',
        password: 'password',
      },
    });

    expect(res.statusCode).toEqual(200);
  });
});
