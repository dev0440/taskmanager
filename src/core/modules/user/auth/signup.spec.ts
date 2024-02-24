import crypto from 'node:crypto';
import { faker } from '@faker-js/faker';
import { SignupUseCase } from './signup';
import { Right } from '../../../common/Either';

const email = faker.internet.email();
const password = faker.internet.password();
const hash = faker.string.sample();
const salt = faker.string.sample();
const saltBuf = Buffer.from(salt);

const mockRandom = jest.fn().mockImplementation(() => {
  return saltBuf;
});

const mockScryptSync = jest.fn().mockImplementation(() => {
  return hash;
});

describe('Signup', () => {
  let signupUsecase: SignupUseCase;

  beforeEach(() => {
    jest.spyOn(crypto, 'randomBytes').mockImplementation(mockRandom);
    jest.spyOn(crypto, 'scryptSync').mockImplementation(mockScryptSync);
    signupUsecase = new SignupUseCase();
  });

  afterEach(() => {});

  it('Should sign up user', async () => {
    const res = await signupUsecase.execute({
      email,
      password,
    });

    expect(mockRandom).toHaveBeenCalledTimes(1);
    expect(mockRandom).toHaveBeenCalledWith(8);

    expect(crypto.scryptSync).toHaveBeenCalledTimes(1);
    expect(crypto.scryptSync).toHaveBeenCalledWith(
      password,
      saltBuf.toString('hex'),
      64,
    );

    expect(res).toEqual(
      Right.of({
        token: hash,
      }),
    );
  });
});
