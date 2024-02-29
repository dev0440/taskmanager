import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SignupUseCase } from '../../../core/modules/user/usecases/auth/signup';
import { SignupParams } from '../../../core/modules/user/usecases/auth/types';
import { UserRepository } from '../../../core/modules/user/infra/userRepository';

declare module 'fastify' {
  interface FastifyInstance {
    auth: {
      signup: SignupUseCase;
    };
  }
}

export function signupRoutes(
  fastify: FastifyInstance,
  __: FastifyPluginOptions,
  done: () => void,
) {
  fastify.decorate('auth', { signup: new SignupUseCase(new UserRepository()) });
  fastify.route<{
    Body: SignupParams;
  }>({
    url: '/signup',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        properties: {
          password: {
            type: 'string',
            minLength: 8,
          },
          email: {
            type: 'string',
            format: 'email',
          },
        },
        required: ['password', 'email'],
      },
    },
    handler: async (req, rep) => {
      const { email, password } = req.body;
      const res = await fastify.auth.signup.execute({ email, password });
      if (res.isLeft()) {
        const { code, message } = rep.errorFormatter.of(res.getLeft()!);
        return rep.code(code).send({ message });
      }
      return { user: res.getRight() };
    },
  });
  done();
}
