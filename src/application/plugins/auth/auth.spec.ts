import { faker } from '@faker-js/faker';
import { AppM } from '../../common/mocks/app';
import { AuthFailures, AuthService } from '../../common/services/authService';
import { Either } from '../../../core/common/Either';
import { FastifyInstance, HTTPMethods } from 'fastify';
import { BaseError } from '../../../core/common/errors';

const tokenM = faker.string.sample();
const payloadM = { userId: faker.string.uuid() };

const verifyM = jest.fn().mockImplementation(() => Either.right(payloadM));
const handlerM = jest.fn().mockImplementation((__, res) => {
  res.code().send();
});
const getRouteM =
  (url = '/', method: HTTPMethods = 'GET') =>
  async (fastify: FastifyInstance) => {
    fastify.route({
      url,
      method,
      handler: handlerM,
    });
  };

jest.spyOn(AuthService.prototype, 'verify').mockImplementation(verifyM);

describe('Auth plugin', () => {
  let app: AppM;

  beforeEach(() => {
    const routes = getRouteM();
    app = AppM.build([], [routes]);
  });

  afterEach(() => {
    verifyM.mockClear();
    handlerM.mockClear();
  });

  it('should authenicate user', async () => {
    await app.inject({
      path: '/',
      method: 'GET',
      headers: { authorization: `Bearer ${tokenM}` },
      body: {},
    });

    expect(verifyM).toHaveBeenCalledTimes(1);
    expect(verifyM).toHaveBeenCalledWith(tokenM);
    expect(handlerM).toHaveBeenCalledTimes(1);
  });

  it('should not authenicate user if token missing', async () => {
    const res = await app.inject({
      path: '/',
      method: 'GET',
      headers: { authorization: 'Bearer ' },
      body: {},
    });

    expect(verifyM).not.toHaveBeenCalled();
    expect(res.statusCode).toEqual(400);
    expect(res.json()).toEqual({ message: 'Access token missing' });
  });

  it('should reject authenication', async () => {
    verifyM.mockRestore();
    verifyM.mockReturnValueOnce(
      Either.left(new BaseError(AuthFailures.ExpiredToken, 'Expired token')),
    );
    const res = await app.inject({
      path: '/',
      method: 'GET',
      headers: { authorization: 'Bearer token' },
      body: {},
    });

    expect(verifyM).toHaveBeenCalledTimes(1);
    expect(verifyM).toHaveBeenCalledWith('token');
    expect(res.statusCode).toEqual(400);
    expect(res.json()).toEqual({ message: 'Access token expired' });
  });

  it('should skip if public route', async () => {
    const routes = getRouteM('/signup', 'POST');
    app = AppM.build([], [routes]);

    await app.inject({
      path: '/signup',
      method: 'POST',
      body: {},
    });

    expect(verifyM).not.toHaveBeenCalled();
    expect(handlerM).toHaveBeenCalledTimes(1);
  });
});
