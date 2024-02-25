import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SignupUseCase } from '../../../core/modules/user/auth/signup';
import { SignupParams } from '../../../core/modules/user/auth/types';

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
  fastify.decorate('auth', { signup: new SignupUseCase() });

  fastify.route<{
    Body: SignupParams;
  }>({
    url: '/signup',
    method: 'POST',
    handler: async (req, rep) => {
      const { email, password } = req.body;

      const res = await fastify.auth.signup.execute({ email, password });

      if (res.isLeft()) {
        const { code, message } = rep.errorFormatter.of(res.getLeft()!);
        return rep.code(code).send({ message });
      }

      return { token: res.getRight() };
    },
  });
  done();
}
