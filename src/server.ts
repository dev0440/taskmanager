import { build } from './application/app.js';

const app = build();

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  } else {
    console.log(`Server listening on ${address}`);
  }
});
