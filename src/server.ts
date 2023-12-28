import Fastify from 'fastify';

const app = Fastify({
  logger: {
    level: 'info',
  },
});

app.get('/', (req, res) => {
  res.send('Hellooh');
});

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  } else {
    console.log(`Server listening on ${address}`);
  }
});
