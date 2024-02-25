import { faker } from '@faker-js/faker';
import { SignupUseCase } from '../../../core/modules/user/auth/signup';
import { App } from '../../app';
import { FastifyInstance } from 'fastify';
import { Left, Right } from '../../../core/common/Either';
import { signupRoutes } from './signup';
import { AuthFailures } from '../../../core/modules/user/auth/failures';
import { HTTP_ERRORS } from '../../common/errors';

const token = faker.string.sample();
const password = faker.internet.password();
const email = faker.internet.email();

const signupImpl = jest
  .fn()
  .mockImplementation(() => Promise.resolve(Right.of(token)));

describe('Signup routes', () => {
  let server: FastifyInstance;

  beforeEach(() => {
    jest
      .spyOn(SignupUseCase.prototype, 'execute')
      .mockImplementation(signupImpl);
  });

  beforeAll(() => {
    server = new App([], [signupRoutes], {}).getServer();
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
      Left.of({
        type: AuthFailures.UserAlreadyExistsFailure,
      }),
    );

    const res = await server.inject({
      method: 'post',
      path: '/signup',
      body,
    });

    const expectedResponse = HTTP_ERRORS[AuthFailures.UserAlreadyExistsFailure];

    expect(res.statusCode).toEqual(expectedResponse.code);
    expect(res.json()).toEqual({ message: expectedResponse.message });
  });
});
