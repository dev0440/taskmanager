import Fastify, {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyServerOptions,
} from 'fastify';
import signupRoute from './routes/auth/signup';

import { errorHandler } from './plugins/errors';

export class App {
  server: FastifyInstance;

  constructor(
    plugins: FastifyPluginCallback[],
    routes: FastifyPluginCallback[],
    options: FastifyServerOptions,
  ) {
    this.server = Fastify(options);

    this.applyErrHandlers();

    for (const plugin of plugins) {
      this.server.register(plugin);
    }
    for (const route of routes) {
      this.server.register(route);
    }
  }

  applyErrHandlers() {
    this.server.decorateReply('errorHandler', errorHandler);
  }
  getServer() {
    return this.server;
  }
}

export function build() {
  const app = new App([], [signupRoute], {
    logger: {
      level: 'info',
    },
  });
  return app.getServer();
}
