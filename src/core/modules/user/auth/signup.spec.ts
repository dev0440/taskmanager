import crypto from 'node:crypto';
import { faker } from '@faker-js/faker';
import { SignupUseCase } from './signup';
import { Left, Right } from '../../../common/Either';
import { UserRepository } from '../infra/userRepository';
import { AuthFailures } from './failures';
import { User } from '../domain/user';

const email = faker.internet.email();
const password = faker.internet.password();
const id = faker.string.uuid();
const hash = faker.string.sample();
const salt = faker.string.sample();

const saltBuf = Buffer.from(salt);
const hashBuf = Buffer.from(hash);

const mockRandom = jest.fn().mockImplementation(() => {
  return saltBuf;
});

const mockScryptSync = jest.fn().mockImplementation(() => {
  return hashBuf;
});
const mockSaveUser = jest.fn().mockImplementation((data) => {
  return Promise.resolve({ id, ...data });
});

jest.spyOn(crypto, 'randomBytes').mockImplementation(mockRandom);
jest.spyOn(crypto, 'scryptSync').mockImplementation(mockScryptSync);
jest.spyOn(UserRepository.prototype, 'save').mockImplementation(mockSaveUser);

describe('Signup', () => {
  let signupUsecase: SignupUseCase;

  beforeEach(() => {
    signupUsecase = new SignupUseCase(new UserRepository());
  });

  afterEach(() => {
    mockRandom.mockClear();
    mockScryptSync.mockClear();
    mockSaveUser.mockClear();
  });

  it('Should sign up user', async () => {
    const res = await signupUsecase.execute({
      email,
      password,
    });

    expect(mockRandom).toHaveBeenCalledTimes(1);
    expect(mockRandom).toHaveBeenCalledWith(8);

    expect(mockRandom).toHaveBeenCalledTimes(1);
    expect(crypto.scryptSync).toHaveBeenCalledWith(
      password,
      saltBuf.toString('hex'),
      64,
    );

    expect(mockSaveUser).toHaveBeenCalledTimes(1);
    expect(mockSaveUser).toHaveBeenCalledWith({
      email,
      password: `${hashBuf.toString('hex')}:${saltBuf.toString('hex')}`,
    });

    expect(res).toEqual(
      Right.of({
        id,
        email,
        password: `${hashBuf.toString('hex')}:${saltBuf.toString('hex')}`,
      }),
    );
  });

  it('Should reject if user exists', async () => {
    jest
      .spyOn(UserRepository.prototype, 'get')
      .mockImplementation(() =>
        Promise.resolve([new User(id, email, password)]),
      );

    const res = await signupUsecase.execute({
      email,
      password,
    });

    expect(res).toEqual(
      Left.of({
        type: AuthFailures.UserAlreadyExistsFailure,
        reason: 'User already exists',
      }),
    );
  });
});
