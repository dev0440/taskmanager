import { FastifyInstance, RouteOptions } from 'fastify';
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
  opts: RouteOptions,
  done: () => void,
) {
  fastify.route<{
    Body: ISignup;
  }>({
    url: '/signup',
    method: 'POST',
    handler: async (req) => {
      const { email, password } = req.body;

      const token = await fastify.userService.signup({ email, password });

      return { token };
    },
  });
  done();
}
