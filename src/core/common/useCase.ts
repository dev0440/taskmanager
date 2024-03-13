import { Result } from './Either';
import { BaseError } from './errors';

export interface UseCase<Params, Failures extends string, R> {
  execute(params: Params): Promise<Result<BaseError<Failures>, R>>;
}

export type PromiseEither<L extends string, R> = Promise<
  Result<BaseError<L>, R>
>;
