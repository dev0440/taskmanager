import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { AuthService } from '../../common/services/authService';

const overrideSymbol = Symbol.for('skip-override');

declare module 'fastify' {
  interface FastifyInstance {
    auth: AuthService;
  }
}

const parseJWT = (header: string): string | null => {
  const res = /^\s?Bearer\s([\S]+)$/.exec(header);
  if (!res) return null;
  const { 1: token } = res;
  return token;
};

export function auth(
  fastify: FastifyInstance,
  __: FastifyPluginOptions,
  done: () => void,
) {
  const authService = AuthService.of('secret');

  fastify.decorate('auth', authService);
  fastify.addHook('onRequest', (req, res, done) => {
    const { headers = {} } = req;
    if (headers.authorization) {
      const token = parseJWT(headers.authorization);
      if (token) {
        // const verified = fastify.auth.verify(token);
        return done();
      }
      return res.status(400).send({});
    }
    done();
  });
  done();
}

auth[overrideSymbol] = true;
