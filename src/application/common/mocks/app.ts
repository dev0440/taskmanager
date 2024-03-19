import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  InjectOptions,
} from 'fastify';
import { App } from '../../app';
import { OutgoingHttpHeaders } from 'http2';
import { Config } from '../../plugins/config/config';

export class AppM extends App {
  validator = jest.fn();
  serivlizer = jest.fn();

  response: {
    statusCode?: number;
    json: () => any;
    headers: OutgoingHttpHeaders;
  } = { json() {}, headers: {} };

  static build(
    plugins: FastifyPluginCallback[] = [],
    routes: FastifyPluginCallback[] = [],
    config?: Config,
  ) {
    const app = new AppM(plugins, routes, {});
    if (config) {
      app.getServer().config = config;
    }
    return app;
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
