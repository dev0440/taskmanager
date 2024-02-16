import { FastifyInstance } from 'fastify';
import signupRoutes from './auth/signup';

export function registerRoutes(fastify: FastifyInstance) {
  fastify.register(signupRoutes);
}
