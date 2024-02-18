export class HTTPError extends Error {
  code: number;
  message: string;

  constructor(code: number, message: string) {
    super();
    this.code = code;
    this.message = message;
  }
  static internalError() {
    return new HTTPError(500, 'Internal server error');
  }
}
