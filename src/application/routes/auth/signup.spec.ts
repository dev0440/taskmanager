import { faker } from '@faker-js/faker';
import { SignupUseCase } from '../../../core/modules/user/usecases/auth/signup';
import { Either } from '../../../core/common/Either';
import { signupRoutes } from './signup';
import { AuthFailures } from '../../../core/modules/user/usecases/auth/failures';
import { HttpErrorFormatter } from '../../common/errors';
import { AppM } from '../../common/mocks/app';
import { bodySchema } from './schemas';
import { AuthService } from '../../common/services/authService';

const passwordM = faker.internet.password();
const emailM = faker.internet.email();
const userM = { id: faker.string.uuid(), email: emailM };
const tokenM = faker.string.sample();
const errorM = {
  statusCode: 404,
  message: 'Not found',
};

const signM = jest.fn().mockImplementation(() => tokenM);
const signupM = jest
  .fn()
  .mockImplementation(() => Promise.resolve(Either.right(userM)));
const errrorFormatM = jest.fn().mockImplementation(() => errorM);

describe('Signup routes', () => {
  let app: AppM;

  jest.spyOn(SignupUseCase.prototype, 'execute').mockImplementation(signupM);
  jest
    .spyOn(HttpErrorFormatter.prototype, 'of')
    .mockImplementation(errrorFormatM);
  jest.spyOn(AuthService.prototype, 'sign').mockImplementation(signM);

  beforeEach(() => {
    app = AppM.build([], [signupRoutes]);
    app.mockValidator();
  });

  afterEach(() => {
    signupM.mockClear();
    errrorFormatM.mockClear();
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
    const failure = {
      type: AuthFailures.UserAlreadyExistsFailure,
    };
    signupM.mockRestore();
    signupM.mockResolvedValue(Either.left(failure));

    await app.inject({
      method: 'post',
      path: '/signup',
      body: { email: emailM, password: passwordM },
    });

    app.assertResponse(errorM.statusCode, { message: errorM.message });
    expect(errrorFormatM).toHaveBeenCalledTimes(1);
    expect(errrorFormatM).toHaveBeenCalledWith(failure);
  });
});
