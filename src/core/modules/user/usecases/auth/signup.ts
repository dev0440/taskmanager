import { randomBytes, scryptSync } from 'node:crypto';

import { Either } from '../../../../common/Either';
import { UseCase, PromiseEither } from '../../../../common/useCase';
import { AuthErrors } from './errors';
import { SignupParams } from './types';
import { UserRepository } from '../../infra/userRepository';
import { BaseError } from '../../../../common/errors';

export interface UserDto {
  id: string;
  email: string;
}

export class SignupUseCase
  implements UseCase<SignupParams, AuthErrors, UserDto>
{
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: SignupParams): PromiseEither<AuthErrors, UserDto> {
    const users = await this.userRepository.get({ email });
    if (users.length > 0) {
      return Either.left(
        new BaseError<AuthErrors>(
          AuthErrors.UserAlreadyExistsError,
          'User alredy exists',
        ),
      );
    }
    const salt = randomBytes(8).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    const user = await this.userRepository.save({
      email,
      password: `${hash}:${salt}`,
    });
    return Either.right({
      id: user.id,
      email: user.email,
    });
  }
}
