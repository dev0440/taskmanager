import { faker } from '@faker-js/faker';
import fastify, { FastifyInstance } from 'fastify';
import signup from './signup';

const token = faker.string.sample();
const password = faker.internet.password();
const email = faker.internet.email();

const signupImpl = jest.fn().mockImplementation(() => Promise.resolve(token));

describe('Signup routes', () => {
  let server: FastifyInstance;

  beforeAll(() => {
    server = fastify({});
    server.register(signup);
    server.userService = { signup: signupImpl };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should signup user', async () => {
    const body = { email, password };

    const res = await server.inject({
      method: 'POST',
      path: '/signup',
      body,
    });

    expect(signupImpl).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
    expect(res.json()).toEqual({
      token,
    });
  });
});
