import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { AuthFailures, AuthService, LeftError } from './authService';
import { Right } from '../../../core/common/Either';

const tokenM = faker.string.sample();
const secretM = faker.string.sample();
const userIdM = faker.string.uuid();
const jwtPayoload = { id: userIdM };

const verifyM = jest.fn().mockImplementation(() => jwtPayoload);
const signM = jest.fn().mockImplementation(() => tokenM);

jest.spyOn(jwt, 'sign').mockImplementation(signM);
jest.spyOn(jwt, 'verify').mockImplementation(verifyM);

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = AuthService.of(secretM);
  });

  afterEach(() => {
    verifyM.mockClear();
    signM.mockClear();
  });

  it('should generate jwt token', () => {
    const res = service.sign(jwtPayoload);

    expect(res).toEqual(Right.of(tokenM));
    expect(signM).toHaveBeenCalledTimes(1);
    expect(signM).toHaveBeenCalledWith(jwtPayoload, secretM, {
      expiresIn: '7d',
      algorithm: 'RS256',
    });
  });

  it('should handle signing rejection', () => {
    const errorM = 'Signing error';
    signM.mockRestore();
    signM.mockImplementation(() => {
      throw new Error(errorM);
    });

    const res = service.sign(jwtPayoload);

    expect(res).toEqual(new LeftError(AuthFailures.SigningError, errorM));
    expect(signM).toHaveBeenCalledTimes(1);
    expect(signM).toHaveBeenCalledWith(jwtPayoload, secretM, {
      expiresIn: '7d',
      algorithm: 'RS256',
    });
  });

  it('should verify jwt token', () => {
    const res = service.verify(tokenM);

    expect(verifyM).toHaveBeenCalledTimes(1);
    expect(verifyM).toHaveBeenCalledWith(tokenM, secretM, {
      complete: true,
    });
    expect(res).toEqual(Right.of(jwtPayoload));
  });

  it('should reject verification', () => {
    const errorM = 'Expired token';
    verifyM.mockRestore();
    verifyM.mockImplementation(() => {
      throw Error(errorM);
    });

    const res = service.verify(tokenM);

    expect(verifyM).toHaveBeenCalledTimes(1);
    expect(verifyM).toHaveBeenCalledWith(tokenM, secretM, {
      complete: true,
    });
    expect(res).toEqual(new LeftError(AuthFailures.InvalidToken, errorM));
  });

  it('should reject verification if token missing', () => {
    const res = service.verify('');

    expect(res).toEqual(
      new LeftError(AuthFailures.InvalidToken, 'Missing token'),
    );
  });
});
