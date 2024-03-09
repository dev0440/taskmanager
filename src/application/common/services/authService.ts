import { sign, verify } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { Either, Result } from '../../../core/common/Either';

class BaseError<T extends string> extends Error {
  constructor(
    public type: T,
    public message: string,
  ) {
    super();
  }
  // static of<T extends string>(type: T, message: string) {
  //   return new BaseError<T>(type, message);
  // }
}

export enum AuthFailures {
  InvalidToken = 'InvalidToken',
  ExpiredToken = 'ExpiredToken',
  MissingToken = 'Token',
  SigningError = 'SigningError',
}

export type AuthError = BaseError<AuthFailures>;

export class LeftError<T extends string> extends Either<BaseError<T>, null> {
  constructor(type: T, message: string) {
    const error = new BaseError<T>(type, message);
    super(error, null);
  }
}

export class AuthService {
  constructor(private secret: string) {}

  static of(secret: string) {
    return new AuthService(secret);
  }
  sign(payload: JwtPayload): Result<AuthError, string> {
    try {
      const token = sign(payload, this.secret, {
        algorithm: 'RS256',
        expiresIn: '7d',
      });
      return Either.right(token);
    } catch (err: any) {
      return new LeftError(AuthFailures.SigningError, err.message);
    }
  }

  verify(token: string): Result<AuthError, JwtPayload | string> {
    if (!token) {
      return new LeftError(AuthFailures.MissingToken, 'Missing token');
    }
    try {
      const payload = verify(token, this.secret, { complete: true });
      return Either.right(payload);
    } catch (err: any) {
      return new LeftError(AuthFailures.InvalidToken, err.message);
    }
  }
}
