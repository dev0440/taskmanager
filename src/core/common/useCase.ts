import { Either } from './Either';
import { Failure } from './errors';

export interface UseCase<Params, Failures extends string, Result> {
  execute(params: Params): Promise<Either<Failure<Failures>, Result>>;
}

export type PromiseEither<L extends string, R> = Promise<Either<Failure<L>, R>>;
