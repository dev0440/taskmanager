import { randomBytes, scryptSync } from 'node:crypto';

import { Right } from '../../../common/Either';
import { UseCase, PromiseEither } from '../../../common/useCase';
import { AuthFailures } from './failures';
import { SignupParams, SignupResult } from './types';

export class SignupUseCase
  implements UseCase<SignupParams, AuthFailures, SignupResult>
{
  constructor() {}
  async execute({
    // email,
    password,
  }: SignupParams): PromiseEither<AuthFailures, SignupResult> {
    const salt = randomBytes(8).toString('hex');
    const hash = scryptSync(password, salt, 64);

    return Promise.resolve(Right.of({ token: hash.toString('hex') }));
  }
}
