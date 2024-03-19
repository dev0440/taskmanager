import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { AuthFailures, AuthService } from '../../common/services/authService';
import { HttpError, IHttpError } from '../../common/errors';

const overrideSymbol = Symbol.for('skip-override');

declare module 'fastify' {
  interface FastifyInstance {
    auth: AuthService;
  }
  interface FastifyRequest {
    user: { id: string };
  }
}

const parseJWT = (header: string): string | null => {
  const res = /^\s?Bearer\s([\S]+)$/.exec(header);
  if (!res) return null;
  const { 1: token } = res;
  return token;
};

const AUTH_HTTP_ERRORS: Record<string, IHttpError> = {
  [AuthFailures.ExpiredToken]: {
    statusCode: 400,
    message: 'Access token expired',
  },
  [AuthFailures.MissingToken]: {
    statusCode: 400,
    message: 'Access token missing',
  },
  [AuthFailures.InvalidToken]: {
    statusCode: 400,
    message: 'Invalid access token',
  },
};

class AuthHttpError extends HttpError {
  constructor(type?: string) {
    if (type) {
      const { statusCode, message } = AUTH_HTTP_ERRORS[type];
      super(statusCode, message);
    } else {
      super(400, 'Authenication error');
    }
  }
}

const isPublic = (url: string, method: string) => {
  return url === '/signup' && method === 'POST';
};
export function authPlugin(
  fastify: FastifyInstance,
  __: FastifyPluginOptions,
  done: () => void,
) {
  const configs = fastify.config;
  const authService = AuthService.of(configs.secret);

  fastify.decorate('auth', authService);
  fastify.addHook('onRequest', (req, __, done) => {
    if (isPublic(req.url, req.method)) {
      return done();
    }
    const { headers = {} } = req;
    if (headers.authorization) {
      const token = parseJWT(headers.authorization);
      if (!token) {
        throw new AuthHttpError(AuthFailures.MissingToken);
      }
      const result = fastify.auth.verify(token);
      if (result.isLeft()) {
        throw new AuthHttpError(result.getLeft()?.type);
      }
      return done();
    }
    done(new AuthHttpError(AuthFailures.MissingToken));
  });
  done();
}

authPlugin[overrideSymbol] = true;
