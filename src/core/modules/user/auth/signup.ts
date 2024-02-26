import { randomBytes, scryptSync } from 'node:crypto';

import { Right } from '../../../common/Either';
import { UseCase, PromiseEither } from '../../../common/useCase';
import { AuthFailures } from './failures';
import { SignupParams } from './types';
import { UserRepository } from '../infra/userRepository';
import { User } from '../domain/user';

export class SignupUseCase
  implements UseCase<SignupParams, AuthFailures, User>
{
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: SignupParams): PromiseEither<AuthFailures, User> {
    const salt = randomBytes(8).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');

    const user = await this.userRepository.save({
      email,
      password: `${hash}:${salt}`,
    });

    return Right.of(user);
  }
}