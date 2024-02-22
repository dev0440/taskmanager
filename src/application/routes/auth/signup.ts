import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { UserService } from '../../../core/types';

interface ISignup {
  email: string;
  password: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    userService: UserService;
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

      const res = await fastify.userService.signup({ email, password });

      if (res.isRight()) {
        return { token: res.getRight() };
      }

      const { code, message } = rep.errorHandler.of(res.getLeft());
      rep.code(code).send({ message });
    },
  });
  done();
}
