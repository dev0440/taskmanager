import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SignupUseCase } from '../../../core/modules/user/usecases/auth/signup';
import { SignupParams } from '../../../core/modules/user/usecases/auth/types';
import { UserRepository } from '../../../core/modules/user/infra/userRepository';
import { bodySchema, responseSchema } from './schemas';
import { HttpError, IHttpError } from '../../common/errors';
import { AuthErrors } from '../../../core/modules/user/usecases/auth/errors';

declare module 'fastify' {
  interface FastifyInstance {
    signup: SignupUseCase;
  }
}

export const SIGNUP_HTTP_ERRORS: Record<string, IHttpError> = {
  [AuthErrors.UserAlreadyExistsError]: {
    statusCode: 409,
    message: 'Email already registered',
  },
};

class AuthHttpError extends HttpError {
  constructor(type?: string) {
    if (type) {
      const { statusCode, message } = SIGNUP_HTTP_ERRORS[type];
      super(statusCode, message);
    } else {
      super();
    }
  }
}

export function signupRoutes(
  fastify: FastifyInstance,
  __: FastifyPluginOptions,
  done: () => void,
) {
  fastify.decorate('signup', new SignupUseCase(new UserRepository()));
  fastify.route<{
    Body: SignupParams;
  }>({
    url: '/signup',
    method: 'POST',
    schema: {
      body: bodySchema,
      response: responseSchema,
    },
    handler: async (req, rep) => {
      const { email, password } = req.body;
      const res = await fastify.signup.execute({ email, password });
      if (res.isLeft()) {
        const error = res.getLeft();
        throw new AuthHttpError(error?.type);
      }
      const user = res.getRight();
      if (user) {
        const token = fastify.auth.sign({ id: user.id });
        return rep
          .code(201)
          .header('Authorization', `Bearer ${token}`)
          .send(user);
      }
    },
  });
  done();
}
