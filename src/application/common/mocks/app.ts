import {
  FastifyPluginCallback,
  FastifyServerOptions,
  InjectOptions,
} from 'fastify';
import { App } from '../../app';

export class AppM extends App {
  validator = jest.fn();
  serivlizer = jest.fn();

  response: { statusCode?: number; json: () => any } = { json() {} };

  static of(
    plugins: FastifyPluginCallback[],
    routes: FastifyPluginCallback[],
    options: FastifyServerOptions = {},
  ) {
    return new AppM(plugins, routes, options);
  }

  mockValidator() {
    this.server.setValidatorCompiler(this.validator);
  }

  mockSerializer() {
    this.server.setSerializerCompiler(this.serivlizer);
  }

  assertValidation(args: {
    url: string;
    method: string;
    httpPart: string;
    schema: object;
  }) {
    expect(this.validator).toHaveReturnedTimes(1);
    expect(this.validator).toHaveBeenCalledWith(args);
  }

  assertResponse(statusCode: number, body: object) {
    expect(this.response.statusCode).toEqual(statusCode);
    expect(this.response.json()).toEqual(body);
  }

  async inject(opts: InjectOptions) {
    this.response = await this.server.inject(opts);
  }
}
