import Fastify from 'fastify';

const fastify = Fastify({});

fastify.get('/', (req, res) => {
  res.send('Hellooh');
});

fastify.listen({ port: 3000 });
