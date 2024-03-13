import { faker } from '@faker-js/faker';
import { SignupUseCase } from '../../../core/modules/user/usecases/auth/signup';
import { Either } from '../../../core/common/Either';
import { signupRoutes } from './signup';
import { AuthErrors } from '../../../core/modules/user/usecases/auth/errors';
import { AppM } from '../../common/mocks/app';
import { bodySchema } from './schemas';
import { AuthService } from '../../common/services/authService';
import { BaseError } from '../../../core/common/errors';

const passwordM = faker.internet.password();
const emailM = faker.internet.email();
const userM = { id: faker.string.uuid(), email: emailM };
const tokenM = faker.string.sample();

const signM = jest.fn().mockImplementation(() => tokenM);
const signupM = jest
  .fn()
  .mockImplementation(() => Promise.resolve(Either.right(userM)));

describe('Signup routes', () => {
  let app: AppM;

  jest.spyOn(SignupUseCase.prototype, 'execute').mockImplementation(signupM);
  jest.spyOn(AuthService.prototype, 'sign').mockImplementation(signM);

  beforeEach(() => {
    app = AppM.build([], [signupRoutes]);
    app.mockValidator();
  });

  afterEach(() => {
    signupM.mockClear();
  });

  it('should signup user', async () => {
    const body = { email: emailM, password: passwordM };

    await app.inject({
      method: 'POST',
      path: '/signup',
      body,
    });

    expect(signupM).toHaveBeenCalledWith(body);
    expect(signM).toHaveBeenCalledTimes(1);
    expect(signM).toHaveBeenCalledWith({ id: userM.id });

    app.assertValidation({
      schema: bodySchema,
      method: 'POST',
      url: '/signup',
      httpPart: 'body',
    });
    app.assertResponse(201, userM);
    app.assertResponseHeader('authorization', `Bearer ${tokenM}`);
  });

  it('should reject signup ', async () => {
    const error = new BaseError(
      AuthErrors.UserAlreadyExistsError,
      'User already exists',
    );
    signupM.mockRestore();
    signupM.mockResolvedValue(Either.left(error));

    await app.inject({
      method: 'post',
      path: '/signup',
      body: { email: emailM, password: passwordM },
    });

    app.assertResponse(409, { message: 'User already exists' });
  });
});
