import { Result } from './Either';
import { IFailure } from './errors';

export interface UseCase<Params, Failures extends string, Result> {
  execute(params: Params): Promise<Result<IFailure<Failures>, Result>>;
}

export type PromiseEither<L extends string, R> = Promise<
  Result<IFailure<L>, R>
>;
