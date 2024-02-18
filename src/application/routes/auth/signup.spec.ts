import { faker } from '@faker-js/faker';
import { App } from '../../app';
import { FastifyInstance } from 'fastify';
import signup from './signup';
import { HTTPError } from '../../common/errors';

const token = faker.string.sample();
const password = faker.internet.password();
const email = faker.internet.email();

const signupImpl = jest.fn().mockImplementation(() => Promise.resolve(token));

describe('Signup routes', () => {
  let server: FastifyInstance;

  beforeAll(() => {
    server = new App([], [signup], {}).getServer();
    server.userService = { signup: signupImpl };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should signup user', async () => {
    const body = { email, password };

    const res = await server.inject({
      method: 'post',
      path: '/signup',
      body,
    });

    expect(signupImpl).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
    expect(res.json()).toEqual({
      token,
    });
  });

  it('should reject signup ', async () => {
    const body = { email, password };

    const error = new HTTPError(409, 'Already exists');

    signupImpl.mockRestore();
    signupImpl.mockRejectedValue(error);

    const res = await server.inject({
      method: 'post',
      path: '/signup',
      body,
    });

    expect(res.statusCode).toEqual(error.code);
    expect(res.json()).toEqual({ error: error.message });
  });
});
