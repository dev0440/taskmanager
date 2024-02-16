import Fastify from 'fastify';
import { registerRoutes } from './routes/register';

export function build() {
  const app = Fastify({
    logger: {
      level: 'info',
    },
  });

  registerRoutes(app);

  let counter = 0;

  app.get('/', (__, res) => {
    res.send(counter++);
  });

  return app;
}
