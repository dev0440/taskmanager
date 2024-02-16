import fastify from 'fastify';
import signup from './signup';
import { SignupController, User } from './signup';

describe('Signup controller', () => {
  const hash = '1i3msnn2iasfk';
  const hashPassword = jest.fn(() => hash);
  const saveUser = jest.fn((user: User) => Promise.resolve(user));

  const signupController = new SignupController({ saveUser }, { hashPassword });

  beforeEach(() => {
    hashPassword.mockClear();
    saveUser.mockClear();
  });

  it('Should hash password and save user', async () => {
    const credentials = {
      email: 'test@email.com',
      password: 'password',
    };

    expect(await signupController.signup(credentials)).toEqual({
      email: credentials.email,
      password: hash,
    });

    expect(hashPassword).toHaveBeenCalledTimes(1);
    expect(hashPassword).toHaveBeenCalledWith(credentials.password);

    expect(saveUser).toHaveBeenCalledTimes(1);
    expect(saveUser).toHaveBeenCalledWith({
      email: credentials.email,
      password: hash,
    });
  });
});

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
