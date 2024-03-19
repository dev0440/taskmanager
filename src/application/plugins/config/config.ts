import fastifyEnv from '@fastify/env';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export interface Config {
  secret: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
  }
}

export const configSchema = {
  type: 'object',
  required: ['secret'],
  properties: {
    secret: { type: 'string' },
  },
};

export function configsPlugin(
  fastify: FastifyInstance,
  __: FastifyPluginOptions,
  done: () => void,
) {
  fastify.register(fastifyEnv, { schema: configSchema, dotenv: true });
  done();
}

const overrideSymbol = Symbol.for('skip-override');
configsPlugin[overrideSymbol] = true;
