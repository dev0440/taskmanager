import { faker } from '@faker-js/faker';
import { SignupUseCase } from '../../../core/modules/user/usecases/auth/signup';
import { App } from '../../app';
import { FastifyInstance } from 'fastify';
import { Left, Right } from '../../../core/common/Either';
import { signupRoutes } from './signup';
import { AuthFailures } from '../../../core/modules/user/usecases/auth/failures';
import { HttpErrorFormatter } from '../../common/errors';

const passwordM = faker.internet.password();
const emailM = faker.internet.email();
const userM = { id: faker.string.uuid(), email: emailM };
const errorM = {
  code: 404,
  message: 'Http error',
};

const signupM = jest
  .fn()
  .mockImplementation(() => Promise.resolve(Right.of(userM)));
const errrorFormatM = jest.fn().mockImplementation(() => errorM);

describe('Signup routes', () => {
  let server: FastifyInstance;

  jest.spyOn(SignupUseCase.prototype, 'execute').mockImplementation(signupM);
  jest
    .spyOn(HttpErrorFormatter.prototype, 'of')
    .mockImplementation(errrorFormatM);

  beforeEach(() => {
    server = new App([], [signupRoutes], {}).getServer();
  });

  afterEach(() => {
    signupM.mockClear();
    errrorFormatM.mockClear();
  });

  it('should signup user', async () => {
    const body = { email: emailM, password: passwordM };
    const res = await server.inject({
      method: 'post',
      path: '/signup',
      body,
    });

    expect(signupM).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
    expect(res.json()).toEqual({
      user: userM,
    });
  });

  it('should reject signup ', async () => {
    const failure = {
      type: AuthFailures.UserAlreadyExistsFailure,
    };
    signupM.mockRestore();
    signupM.mockResolvedValue(Left.of(failure));
    const res = await server.inject({
      method: 'post',
      path: '/signup',
      body: { email: emailM, password: passwordM },
    });

    expect(errrorFormatM).toHaveBeenCalledTimes(1);
    expect(errrorFormatM).toHaveBeenCalledWith(failure);
    expect(res.statusCode).toEqual(errorM.code);
    expect(res.json()).toEqual({ message: errorM.message });
  });
});
