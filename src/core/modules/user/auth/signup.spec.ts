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

const randomM = jest.fn().mockImplementation(() => {
  return saltBuf;
});
const scryptSyncM = jest.fn().mockImplementation(() => {
  return hashBuf;
});
const saveUserM = jest.fn().mockImplementation((data) => {
  return Promise.resolve({ id, ...data });
});

jest.spyOn(crypto, 'randomBytes').mockImplementation(randomM);
jest.spyOn(crypto, 'scryptSync').mockImplementation(scryptSyncM);
jest.spyOn(UserRepository.prototype, 'save').mockImplementation(saveUserM);

describe('Signup', () => {
  let signupUsecase: SignupUseCase;
  beforeEach(() => {
    signupUsecase = new SignupUseCase(new UserRepository());
  });
  afterEach(() => {
    randomM.mockClear();
    scryptSyncM.mockClear();
    saveUserM.mockClear();
  });

  it('Should sign up user', async () => {
    const res = await signupUsecase.execute({
      email,
      password,
    });

    expect(randomM).toHaveBeenCalledTimes(1);
    expect(randomM).toHaveBeenCalledWith(8);
    expect(crypto.scryptSync).toHaveBeenCalledWith(
      password,
      saltBuf.toString('hex'),
      64,
    );
    expect(saveUserM).toHaveBeenCalledTimes(1);
    expect(saveUserM).toHaveBeenCalledWith({
      email,
      password: `${hashBuf.toString('hex')}:${saltBuf.toString('hex')}`,
    });
    expect(res).toEqual(
      Right.of({
        id,
        email,
      }),
    );
  });

  it('Should reject if email duplication', async () => {
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
