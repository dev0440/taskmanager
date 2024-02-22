import { HttpResponseService } from '../common/errors';
import { AuthFailures } from '../../core/modules/user/failures';

export const HTTP_ERRORS = {
  [AuthFailures.UserAlreadyExistsFailure]: {
    code: 409,
    message: 'User already exists',
  },
};

type Failures = AuthFailures;

declare module 'fastify' {
  interface FastifyReply {
    errorHandler: HttpResponseService<Failures>;
  }
}

export const errorHandler = new HttpResponseService<Failures>(HTTP_ERRORS);
