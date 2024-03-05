import { faker } from '@faker-js/faker';
import { SignupUseCase } from '../../../core/modules/user/usecases/auth/signup';
import { Left, Right } from '../../../core/common/Either';
import { signupRoutes } from './signup';
import { AuthFailures } from '../../../core/modules/user/usecases/auth/failures';
import { HttpErrorFormatter } from '../../common/errors';
import { AppM } from '../../common/mocks/app';
import { bodySchema } from './schemas';

const passwordM = faker.internet.password();
const emailM = faker.internet.email();
const userM = { id: faker.string.uuid(), email: emailM };
const errorM = {
  statusCode: 404,
  message: 'Not found',
};

const signupM = jest
  .fn()
  .mockImplementation(() => Promise.resolve(Right.of(userM)));
const errrorFormatM = jest.fn().mockImplementation(() => errorM);

describe('Signup routes', () => {
  let app: AppM;

  jest.spyOn(SignupUseCase.prototype, 'execute').mockImplementation(signupM);
  jest
    .spyOn(HttpErrorFormatter.prototype, 'of')
    .mockImplementation(errrorFormatM);

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
    app.assertValidation({
      schema: bodySchema,
      method: 'POST',
      url: '/signup',
      httpPart: 'body',
    });
    app.assertResponse(200, userM);
  });

  it('should reject signup ', async () => {
    const failure = {
      type: AuthFailures.UserAlreadyExistsFailure,
    };
    signupM.mockRestore();
    signupM.mockResolvedValue(Left.of(failure));

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
