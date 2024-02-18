import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { UserService } from '../../../core/types';
import { HTTPError } from '../../common/errors';

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
    handler: async (req) => {
      const { email, password } = req.body;

      try {
        const token = await fastify.userService.signup({ email, password });
        return { token };
      } catch (err) {
        if (err instanceof HTTPError) {
          throw err;
        }
        throw HTTPError.internalError();
      }
    },
  });
  done();
}
