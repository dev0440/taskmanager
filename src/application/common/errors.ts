import { Failure } from '../../core/common/errors';

interface HttpErrorRsponse {
  code: number;
  message: string;
}

type HttpErrors<T extends string> = {
  [Prop in T]: HttpErrorRsponse;
};

export class HttpResponseService<E extends string> {
  private httpErrors: HttpErrors<E>;

  constructor(httpErrors: HttpErrors<E>) {
    this.httpErrors = httpErrors;
  }

  of(failure: Failure<E>): HttpErrorRsponse {
    if (this.httpErrors[failure.type]) {
      return this.httpErrors[failure.type];
    }
    return {
      code: 500,
      message: 'Internal server error',
    };
  }
}
