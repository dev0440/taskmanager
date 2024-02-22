import { faker } from '@faker-js/faker';
import { App } from '../../app';
import { FastifyInstance } from 'fastify';
import { Either } from '../../../core/common/Either';
import signup from './signup';
import { AuthFailures } from '../../../core/modules/user/failures';

const token = faker.string.sample();
const password = faker.internet.password();
const email = faker.internet.email();

const signupImpl = jest
  .fn()
  .mockImplementation(() => Promise.resolve(Either.of(null, token)));

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

    signupImpl.mockRestore();
    signupImpl.mockResolvedValue(
      Either.of({
        type: AuthFailures.UserAlreadyExistsFailure,
      }),
    );

    const res = await server.inject({
      method: 'post',
      path: '/signup',
      body,
    });

    expect(res.statusCode).toEqual(409);
    expect(res.json()).toEqual({ message: 'User already exists' });
  });
});
