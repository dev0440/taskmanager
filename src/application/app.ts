import Fastify, {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyServerOptions,
} from 'fastify';
import { signupRoutes } from './routes/auth/signup';

import { auth } from './plugins/auth/auth';

export class App {
  server: FastifyInstance;

  constructor(
    plugins: FastifyPluginCallback[],
    routes: FastifyPluginCallback[],
    options: FastifyServerOptions,
  ) {
    this.server = Fastify(options);
    for (const plugin of plugins) {
      this.server.register(plugin);
    }
    for (const route of routes) {
      this.server.register(route);
    }
    this.server.setErrorHandler((err, __, res) => {
      res.code(err.statusCode!).send({ message: err.message });
    });
  }

  getServer() {
    return this.server;
  }
}

export function build() {
  const app = new App([auth], [signupRoutes], {
    logger: {
      level: 'info',
    },
  });
  return app.getServer();
}
