import fastify, { FastifyInstance } from 'fastify';
import signup from './signup';

const mockToken = 'd82c1ea9a0ja9fg3';
const signupImpl = jest
  .fn()
  .mockImplementation(() => Promise.resolve(mockToken));

describe('Signup routes', () => {
  let server: FastifyInstance;

  beforeAll(() => {
    server = fastify({});
    server.register(signup);
    server.userService = { signup: signupImpl };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should signup user', async () => {
    const body = { email: 'test@email.com', password: 'password' };

    const res = await server.inject({
      method: 'POST',
      path: '/signup',
      body,
    });

    expect(signupImpl).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
    expect(res.json()).toEqual({
      token: mockToken,
    });
  });
});
