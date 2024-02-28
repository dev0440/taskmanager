import { faker } from '@faker-js/faker';
import { SignupUseCase } from '../../../core/modules/user/auth/signup';
import { App } from '../../app';
import { FastifyInstance } from 'fastify';
import { Left, Right } from '../../../core/common/Either';
import { signupRoutes } from './signup';
import { AuthFailures } from '../../../core/modules/user/auth/failures';
import { HttpErrorFormatter } from '../../common/errors';

const password = faker.internet.password();
const email = faker.internet.email();
const user = { id: faker.string.uuid(), email };

const mockError = {
  code: 404,
  message: 'Http error',
};

const signupImpl = jest
  .fn()
  .mockImplementation(() => Promise.resolve(Right.of(user)));
const mockErrorFormatter = jest.fn().mockImplementation(() => mockError);

describe('Signup routes', () => {
  let server: FastifyInstance;

  jest.spyOn(SignupUseCase.prototype, 'execute').mockImplementation(signupImpl);
  jest
    .spyOn(HttpErrorFormatter.prototype, 'of')
    .mockImplementation(mockErrorFormatter);

  beforeEach(() => {
    server = new App([], [signupRoutes], {}).getServer();
  });

  afterEach(() => {
    signupImpl.mockClear();
    mockErrorFormatter.mockClear();
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
      user,
    });
  });

  it('should reject signup ', async () => {
    const failure = {
      type: AuthFailures.UserAlreadyExistsFailure,
    };
    signupImpl.mockRestore();
    signupImpl.mockResolvedValue(Left.of(failure));

    const res = await server.inject({
      method: 'post',
      path: '/signup',
      body: { email, password },
    });

    expect(mockErrorFormatter).toHaveBeenCalledTimes(1);
    expect(mockErrorFormatter).toHaveBeenCalledWith(failure);

    expect(res.statusCode).toEqual(mockError.code);
    expect(res.json()).toEqual({ message: mockError.message });
  });
});
