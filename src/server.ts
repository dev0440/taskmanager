import Fastify from 'fastify';

const app = Fastify({
  logger: {
    level: 'info',
  },
});

let counter = 0;

app.get('/', (__, res) => {
  res.send(counter++);
});

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  } else {
    console.log(`Server listening on ${address}`);
  }
});
