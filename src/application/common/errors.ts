import { IFailure } from '../../core/common/errors';
import { AuthFailures } from '../../core/modules/user/usecases/auth/failures';

interface HttpErrorResponse {
  code: number;
  message: string;
}

type AllFailures = AuthFailures;

type HttpErrors = {
  [key in AllFailures]: HttpErrorResponse;
};

export const HTTP_ERRORS = {
  [AuthFailures.UserAlreadyExistsFailure]: {
    code: 409,
    message: 'User already exists',
  },
};

declare module 'fastify' {
  interface FastifyReply {
    errorFormatter: HttpErrorFormatter;
  }
}

export class HttpErrorFormatter {
  private httpErrors: HttpErrors;

  constructor() {
    this.httpErrors = HTTP_ERRORS;
  }

  of(failure: IFailure<AllFailures>): HttpErrorResponse {
    if (this.httpErrors[failure.type]) {
      return this.httpErrors[failure.type];
    }
    return {
      code: 500,
      message: 'Internal server error',
    };
  }
}
