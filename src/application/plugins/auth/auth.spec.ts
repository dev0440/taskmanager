import { faker } from '@faker-js/faker';
import { AppM } from '../../common/mocks/app';
import { AuthService } from '../../common/services/authService';
import { Either } from '../../../core/common/Either';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

const tokenM = faker.string.sample();
const payloadM = { userId: faker.string.uuid() };

const verifyM = jest.fn().mockImplementation(() => Either.right(payloadM));
const handlerM = jest.fn().mockImplementation((__, res) => {
  res.code().send();
});
const routeM = (
  fastify: FastifyInstance,
  __: FastifyPluginOptions,
  done: () => void,
) => {
  fastify.route({
    url: '/',
    method: 'GET',
    handler: handlerM,
  });
  done();
};

jest.spyOn(AuthService.prototype, 'verify').mockImplementation(verifyM);

describe('Auth plugin', () => {
  let app: AppM;

  beforeEach(() => {
    verifyM.mockClear();
    app = AppM.build([], [routeM]);
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
    expect(res.json()).toEqual({});
  });
});
