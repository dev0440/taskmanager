import { IFailure } from '../../core/common/errors';
import { AuthFailures } from '../../core/modules/user/usecases/auth/failures';

interface HttpErrorObject {
  statusCode: number;
  error: string;
  code?: string;
  message?: string;
}

type AllFailures = AuthFailures;

type HttpErrors = {
  [key in AllFailures]: HttpErrorObject;
};

export const HTTP_ERRORS = {
  [AuthFailures.UserAlreadyExistsFailure]: {
    statusCode: 409,
    error: 'Conflict',
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

  of(failure: IFailure<AllFailures>): HttpErrorObject {
    if (this.httpErrors[failure.type]) {
      return this.httpErrors[failure.type];
    }
    return {
      statusCode: 500,
      error: 'Internal Server Error',
    };
  }
}
