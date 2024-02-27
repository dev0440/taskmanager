import { Either } from './Either';
import { IFailure } from './errors';

export interface UseCase<Params, Failures extends string, Result> {
  execute(params: Params): Promise<Either<IFailure<Failures>, Result>>;
}

export type PromiseEither<L extends string, R> = Promise<
  Either<IFailure<L>, R>
>;
