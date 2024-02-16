import Fastify from 'fastify';

export function build() {
  const app = Fastify({
    logger: {
      level: 'info',
    },
  });

  let counter = 0;

  app.get('/', (__, res) => {
    res.send(counter++);
  });

  return app;
}
