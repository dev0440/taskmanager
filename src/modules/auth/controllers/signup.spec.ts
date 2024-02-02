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
