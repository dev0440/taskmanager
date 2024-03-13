import { AuthErrors } from '../../core/modules/user/usecases/auth/errors';

export interface IHttpError {
  code: string;
  statusCode?: number;
  name: string;
  message: string;
}

const HTTP_ERRORS: Record<string, IHttpError> = {
  [AuthErrors.UserAlreadyExistsError]: {
    statusCode: 409,
    code: 'Auth_Errr',
    name: 'Auth error',
    message: 'User already exists',
  },
};

const INTERNAL_SERVER_ERROR = {
  code: 'code',
  statusCode: 500,
  name: 'Internal_Error',
  message: 'Internal server error',
};

const getHttpError = (type?: string): IHttpError => {
  if (!type) {
    return INTERNAL_SERVER_ERROR;
  }
  const error = HTTP_ERRORS[type];
  if (error) {
    return error;
  }
  return INTERNAL_SERVER_ERROR;
};

export class HttpError<T extends string> implements IHttpError {
  public code: string;
  public statusCode?: number;
  public name: string;
  public message: string;

  constructor(type?: T) {
    const { code, statusCode, name, message } = getHttpError(type);
    this.statusCode = statusCode;
    this.name = name;
    this.code = code;
    this.message = message;
  }
}
