import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SignupUseCase } from '../../../core/modules/user/auth/signup';

interface ISignup {
  email: string;
  password: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    signup: SignupUseCase;
  }
}

export default function (
  fastify: FastifyInstance,
  __: FastifyPluginOptions,
  done: () => void,
) {
  fastify.route<{
    Body: ISignup;
  }>({
    url: '/signup',
    method: 'POST',
    handler: async (req, rep) => {
      const { email, password } = req.body;

      const res = await fastify.signup.execute({ email, password });

      if (res.isLeft()) {
        const { code, message } = rep.errorFormatter.of(res.getLeft()!);
        return rep.code(code).send({ message });
      }

      return { token: res.getRight() };
    },
  });
  done();
}
