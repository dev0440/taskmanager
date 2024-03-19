export interface IHttpError {
  statusCode?: number;
  message?: string;
}

const INTERNAL_SERVER_ERROR = {
  statusCode: 500,
  message: 'Internal server error',
};

export class HttpError extends Error implements IHttpError {
  public statusCode?: number = INTERNAL_SERVER_ERROR.statusCode;

  constructor(statusCode?: number, message?: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
