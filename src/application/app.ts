import Fastify, {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyServerOptions,
} from 'fastify';
import { signupRoutes } from './routes/auth/signup';

import { HttpErrorFormatter } from './common/errors';

export class App {
  server: FastifyInstance;

  constructor(
    plugins: FastifyPluginCallback[],
    routes: FastifyPluginCallback[],
    options: FastifyServerOptions,
  ) {
    this.server = Fastify(options);
    this.applyDecorators();
    for (const plugin of plugins) {
      this.server.register(plugin);
    }
    for (const route of routes) {
      this.server.register(route);
    }
  }

  applyDecorators() {
    const errorFormatter = new HttpErrorFormatter();
    this.server.decorateReply('errorFormatter', errorFormatter);
  }

  getServer() {
    return this.server;
  }
}

export function build() {
  const app = new App([], [signupRoutes], {
    logger: {
      level: 'info',
    },
  });
  return app.getServer();
}
