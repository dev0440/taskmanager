import { FastifyInstance, RouteOptions } from 'fastify';

interface ISignup {
  email: string;
  password: string;
}

export default function (
  fastify: FastifyInstance,
  opts: RouteOptions,
  done: () => void,
) {
  fastify.route<{
    Body: ISignup;
  }>({
    url: '/signup',
    method: 'POST',
    handler: (req, res) => {
      const { email, password } = req.body;

      console.log(email, password);

      res.send('ok');
    },
  });
  done();
}
