import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SignupUseCase } from '../../../core/modules/user/usecases/auth/signup';
import { SignupParams } from '../../../core/modules/user/usecases/auth/types';
import { UserRepository } from '../../../core/modules/user/infra/userRepository';
import { bodySchema, responseSchema } from './schemas';
import { HttpError } from '../../common/errors';

declare module 'fastify' {
  interface FastifyInstance {
    signup: SignupUseCase;
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
        return fastify.errorHandler(new HttpError(error?.type), req, rep);
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
