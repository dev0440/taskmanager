import { FastifyInstance, FastifyRequest, RouteOptions } from 'fastify';

interface ISignup {
  email: string;
  password: string;
}

interface SignupRquest extends FastifyRequest {
  Body: ISignup;
}

export default function (
  fastify: FastifyInstance,
  opts: RouteOptions,
  done: () => void,
) {
  fastify.post<SignupRquest>('/signup', (req, res) => {
    // const body = req.body;
    // const email = body.email;
    // const password = body.password;

    res.send('ok');
  });

  done();
}
