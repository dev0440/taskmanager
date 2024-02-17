import { UserService } from '../../core/types';

declare module 'fastify' {
  interface FastifyInstance {
    userService: UserService;
  }
}
