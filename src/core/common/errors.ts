export interface IFailure<FailureType extends string> {
  type: FailureType;
  reason: string;
}

export class BaseError<T extends string> extends Error {
  constructor(
    public type: T,
    public message: string,
  ) {
    super();
  }
}
