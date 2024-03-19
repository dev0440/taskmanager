import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyServerOptions,
  InjectOptions,
} from 'fastify';
import { App } from '../../app';
import { OutgoingHttpHeaders } from 'http2';
import { authPlugin } from '../../plugins/auth/auth';

export class AppM extends App {
  validator = jest.fn();
  serivlizer = jest.fn();

  response: {
    statusCode?: number;
    json: () => any;
    headers: OutgoingHttpHeaders;
  } = { json() {}, headers: {} };

  static build(
    // eslint-disable-next-line
    plugins: FastifyPluginCallback[] = [],
    routes: FastifyPluginCallback[] = [],
    options: FastifyServerOptions = {},
  ) {
    return new AppM([authPlugin], routes, options);
  }

  register(plugin: FastifyPluginCallback, options?: FastifyPluginOptions) {
    return this.server.register(plugin, options);
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

  assertResponseHeader(headerName: string, headerValue: string) {
    expect(this.response.headers[headerName]).toEqual(headerValue);
  }

  async inject(opts: InjectOptions) {
    this.response = await this.server.inject(opts);
    return this.response;
  }
}
